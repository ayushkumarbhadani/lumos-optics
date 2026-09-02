import hashlib
import hmac
import os
import json
import base64
from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Union
from app.core.config import settings

# Attempt bcrypt import, fallback to salted PBKDF2 if bcrypt not installed
try:
    import bcrypt

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        if hashed_password.startswith("pbkdf2:"):
            return _verify_pbkdf2(plain_password, hashed_password)
        try:
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        except Exception:
            return False

    def get_password_hash(password: str) -> str:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

except ImportError:
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return _verify_pbkdf2(plain_password, hashed_password)

    def get_password_hash(password: str) -> str:
        return _hash_pbkdf2(password)


def _hash_pbkdf2(password: str) -> str:
    salt = os.urandom(16).hex()
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return f"pbkdf2:{salt}:{hashed}"


def _verify_pbkdf2(plain_password: str, hashed_password: str) -> bool:
    try:
        parts = hashed_password.split(":")
        if len(parts) != 3 or parts[0] != "pbkdf2":
            return False
        salt, expected_hash = parts[1], parts[2]
        computed_hash = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
        return hmac.compare_digest(computed_hash, expected_hash)
    except Exception:
        return False


# JWT Handling (Using pyjwt if present, or self-contained fallback)
try:
    import jwt
    from jwt.exceptions import PyJWTError

    def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode = {
            "exp": expire,
            "sub": str(subject),
            "iat": datetime.now(timezone.utc),
        }
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    def decode_token(token: str) -> dict:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

except ImportError:
    # Pure Python HS256 JWT implementation fallback
    def _b64_encode(data: bytes) -> str:
        return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")

    def _b64_decode(data: str) -> bytes:
        padding = 4 - (len(data) % 4)
        if padding != 4:
            data += "=" * padding
        return base64.urlsafe_b64decode(data.encode("utf-8"))

    def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

        header = {"typ": "JWT", "alg": "HS256"}
        payload = {
            "exp": int(expire.timestamp()),
            "sub": str(subject),
            "iat": int(datetime.now(timezone.utc).timestamp()),
        }

        h_b64 = _b64_encode(json.dumps(header).encode("utf-8"))
        p_b64 = _b64_encode(json.dumps(payload).encode("utf-8"))
        msg = f"{h_b64}.{p_b64}".encode("utf-8")
        sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), msg, hashlib.sha256).digest()
        return f"{h_b64}.{p_b64}.{_b64_encode(sig)}"

    def decode_token(token: str) -> dict:
        try:
            parts = token.split(".")
            if len(parts) != 3:
                raise ValueError("Invalid token format")
            h_b64, p_b64, sig_b64 = parts
            msg = f"{h_b64}.{p_b64}".encode("utf-8")
            expected_sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), msg, hashlib.sha256).digest()
            actual_sig = _b64_decode(sig_b64)
            if not hmac.compare_digest(expected_sig, actual_sig):
                raise ValueError("Signature mismatch")
            payload = json.loads(_b64_decode(p_b64).decode("utf-8"))
            if "exp" in payload and datetime.now(timezone.utc).timestamp() > payload["exp"]:
                raise ValueError("Token expired")
            return payload
        except Exception as e:
            raise ValueError(f"Could not validate credentials: {str(e)}")
