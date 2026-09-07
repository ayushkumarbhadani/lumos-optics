def test_create_category_admin(client, admin_headers):
    response = client.post(
        "/api/v1/categories/",
        headers=admin_headers,
        json={"name": "Audio Gear", "description": "High end audio equipment"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Audio Gear"
    assert data["slug"] == "audio-gear"
    assert "id" in data


def test_create_category_forbidden_for_customer(client, customer_headers):
    response = client.post(
        "/api/v1/categories/",
        headers=customer_headers,
        json={"name": "Unauthorized Category"},
    )
    assert response.status_code == 403


def test_list_categories_public(client, admin_headers):
    client.post(
        "/api/v1/categories/",
        headers=admin_headers,
        json={"name": "Smartphones"},
    )
    response = client.get("/api/v1/categories/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any(c["name"] == "Smartphones" for c in data)
