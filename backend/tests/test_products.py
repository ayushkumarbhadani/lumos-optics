def create_sample_category(client, admin_headers):
    res = client.post(
        "/api/v1/categories/",
        headers=admin_headers,
        json={"name": "Laptops", "description": "Portable computers"},
    )
    return res.json()["id"]


def test_create_product_admin(client, admin_headers):
    cat_id = create_sample_category(client, admin_headers)
    response = client.post(
        "/api/v1/products/",
        headers=admin_headers,
        json={
            "title": "MacBook Air M2",
            "description": "Apple Silicon powerhouse laptop",
            "price": 1199.99,
            "stock": 10,
            "sku": "MBA-M2-001",
            "category_id": cat_id,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "MacBook Air M2"
    assert data["price"] == 1199.99
    assert data["stock"] == 10
    assert data["sku"] == "MBA-M2-001"
    assert data["slug"] == "macbook-air-m2"


def test_list_products_filter_and_search(client, admin_headers):
    cat_id = create_sample_category(client, admin_headers)
    client.post(
        "/api/v1/products/",
        headers=admin_headers,
        json={
            "title": "Gaming Laptop 17",
            "price": 2000.00,
            "stock": 5,
            "sku": "GAM-LAP-002",
            "category_id": cat_id,
        },
    )

    # Search keyword
    res = client.get("/api/v1/products/?search=Gaming")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    assert any(p["title"] == "Gaming Laptop 17" for p in data["items"])

    # Price filter
    res_price = client.get("/api/v1/products/?min_price=1500&max_price=2500")
    assert res_price.status_code == 200
    assert any(p["title"] == "Gaming Laptop 17" for p in res_price.json()["items"])


def test_product_validation_errors(client, admin_headers):
    # Negative price should fail validation
    res = client.post(
        "/api/v1/products/",
        headers=admin_headers,
        json={
            "title": "Bad Product",
            "price": -10.0,
            "stock": 5,
            "sku": "BAD-001",
            "category_id": 1,
        },
    )
    assert res.status_code == 422


def test_upload_image_admin(client, admin_headers):
    import io
    fake_image_file = io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb")
    res = client.post(
        "/api/v1/products/upload-image",
        headers=admin_headers,
        files={"file": ("test_frame.jpg", fake_image_file, "image/jpeg")},
    )
    assert res.status_code == 200
    data = res.json()
    assert "url" in data
    assert "provider" in data

