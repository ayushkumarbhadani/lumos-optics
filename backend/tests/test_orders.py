def setup_product_for_order(client, admin_headers):
    cat_res = client.post(
        "/api/v1/categories/",
        headers=admin_headers,
        json={"name": "Audio Video"},
    )
    cat_id = cat_res.json()["id"]

    prod_res = client.post(
        "/api/v1/products/",
        headers=admin_headers,
        json={
            "title": "Studio Microphone",
            "price": 150.00,
            "stock": 10,
            "sku": "MIC-STD-001",
            "category_id": cat_id,
        },
    )
    return prod_res.json()["id"]


def test_checkout_cart_decrements_stock_and_clears_cart(client, admin_headers, customer_headers):
    product_id = setup_product_for_order(client, admin_headers)

    # 1. Add 3 units to cart
    client.post(
        "/api/v1/cart/items",
        headers=customer_headers,
        json={"product_id": product_id, "quantity": 3},
    )

    # 2. Checkout
    checkout_res = client.post(
        "/api/v1/orders/checkout",
        headers=customer_headers,
        json={"shipping_address": "123 Tech Boulevard, Innovation City, CA 94016"},
    )
    assert checkout_res.status_code == 201
    order_data = checkout_res.json()
    assert order_data["status"] == "pending"
    assert order_data["total_amount"] == 450.00
    assert len(order_data["items"]) == 1
    assert order_data["items"][0]["unit_price"] == 150.00
    assert order_data["items"][0]["quantity"] == 3

    # 3. Product stock should be decremented from 10 to 7
    prod_check = client.get(f"/api/v1/products/{product_id}")
    assert prod_check.json()["stock"] == 7

    # 4. Shopping cart should now be empty
    cart_check = client.get("/api/v1/cart/", headers=customer_headers)
    assert cart_check.json()["total_items"] == 0


def test_cancel_order_restores_inventory(client, admin_headers, customer_headers):
    product_id = setup_product_for_order(client, admin_headers)

    # Add 2 units and checkout
    client.post(
        "/api/v1/cart/items",
        headers=customer_headers,
        json={"product_id": product_id, "quantity": 2},
    )
    checkout_res = client.post(
        "/api/v1/orders/checkout",
        headers=customer_headers,
        json={"shipping_address": "456 Market St, San Francisco, CA"},
    )
    order_id = checkout_res.json()["id"]

    # Stock is now 8
    prod_check = client.get(f"/api/v1/products/{product_id}")
    assert prod_check.json()["stock"] == 8

    # Cancel order
    cancel_res = client.post(f"/api/v1/orders/{order_id}/cancel", headers=customer_headers)
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "cancelled"

    # Stock should be restored back to 10
    restored_prod = client.get(f"/api/v1/products/{product_id}")
    assert restored_prod.json()["stock"] == 10
