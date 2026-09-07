def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "securepassword123",
            "full_name": "New User",
            "role": "customer",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New User"
    assert "id" in data
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    user_payload = {
        "email": "duplicate@example.com",
        "password": "securepassword123",
        "full_name": "Duplicate User",
    }
    res1 = client.post("/api/v1/auth/register", json=user_payload)
    assert res1.status_code == 201

    res2 = client.post("/api/v1/auth/register", json=user_payload)
    assert res2.status_code == 409


def test_login_success(client, customer_user):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": customer_user.email, "password": "customerpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == customer_user.email


def test_login_invalid_password(client, customer_user):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": customer_user.email, "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_get_current_user_me(client, customer_headers, customer_user):
    response = client.get("/api/v1/auth/me", headers=customer_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == customer_user.email
    assert data["id"] == customer_user.id
