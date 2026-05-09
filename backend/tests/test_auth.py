import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_signup():
    client = TestClient(app)
    response = client.post("/api/auth/signup", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data

def test_login():
    client = TestClient(app)
    # First signup
    client.post("/api/auth/signup", json={
        "username": "testuser2",
        "email": "test2@example.com",
        "password": "testpass"
    })
    # Then login
    response = client.post("/api/auth/login", json={
        "username": "testuser2",
        "password": "testpass"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_me():
    client = TestClient(app)
    # Signup and get token
    signup_response = client.post("/api/auth/signup", json={
        "username": "testuser3",
        "email": "test3@example.com",
        "password": "testpass"
    })
    token = signup_response.json()["access_token"]
    
    # Get me
    response = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser3"
    assert data["email"] == "test3@example.com"