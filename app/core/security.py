from datetime import UTC, datetime, timedelta

import jwt
from fastapi import HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext

from app.core.config import get_settings

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return password_context.verify(password, password_hash)


def create_access_token(subject: str, role: str) -> str:
    settings = get_settings()
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode({"sub": subject, "role": role, "exp": expires_at}, settings.jwt_secret_key, algorithm="HS256")


def decode_token(credentials: HTTPAuthorizationCredentials | None) -> dict:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    try:
        return jwt.decode(credentials.credentials, get_settings().jwt_secret_key, algorithms=["HS256"])
    except jwt.PyJWTError as error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from error

