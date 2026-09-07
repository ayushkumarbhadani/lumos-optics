def setup_product(client, admin_headers):
    cat_res = client.post(
        "/api/v1/categories/",
        headers=admin_headers,
        json={"name": "Accessories"},
    )
    cat_id = cat_res.json()["id"]

    prod_res = client.post(
        "/api/v1/products/",
        headers=admin_headers,
        json={
            "title": "USB-C Fast Charger",
            "price": 29.99,
            "stock": 10,
            "sku": "CHG-USBC-001",
            "category_id": cat_id,
        },
    )
    return prod_res.json()["id"]


def test_add_to_cart_and_get_cart(client, admin_headers, customer_headers):
    product_id = setup_product(client, admin_headers)

    # Add to cart
    res = client.post(
        "/api/v1/cart/items",
        headers=customer_headers,
        json={"product_id": product_id, "quantity": 2},
    )
    assert res.status_code == 201
    data = res.json()
    assert data["quantity"] == 2
    assert data["subtotal"] == 2 * 29.99

    # View cart
    cart_res = client.get("/api/v1/cart/", headers=customer_headers)
    assert cart_res.status_code == 200
    cart_data = cart_res.json()
    assert cart_data["total_items"] == 2
    assert cart_data["total_amount"] == 59.98
    assert len(cart_data["items"]) == 1


def test_add_to_cart_exceeds_stock(client, admin_headers, customer_headers):
    product_id = setup_product(client, admin_headers)

    # Product stock is 10, try adding 15
    res = client.post(
        "/api/v1/cart/items",
        headers=customer_headers,
        json={"product_id": product_id, "quantity": 15},
    )
    assert res.status_code == 400
    assert "exceeds available stock" in res.json()["detail"]


def test_update_and_remove_cart_item(client, admin_headers, customer_headers):
    product_id = setup_product(client, admin_headers)

    client.post(
        "/api/v1/cart/items",
        headers=customer_headers,
        json={"product_id": product_id, "quantity": 1},
    )

    # Update quantity
    update_res = client.put(
        f"/api/v1/cart/items/{product_id}",
        headers=customer_headers,
        json={"quantity": 4},
    )
    assert update_res.status_code == 200
    assert update_res.json()["quantity"] == 4

    # Remove item
    del_res = client.delete(
        f"/api/v1/cart/items/{product_id}",
        headers=customer_headers,
    )
    assert del_res.status_code == 200

    # Cart should now be empty
    cart_res = client.get("/api/v1/cart/", headers=customer_headers)
    assert cart_res.json()["total_items"] == 0
