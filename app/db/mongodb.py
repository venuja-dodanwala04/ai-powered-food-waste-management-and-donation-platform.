from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings


class MongoDB:
    client: AsyncIOMotorClient | None = None

    async def connect(self) -> None:
        settings = get_settings()
        self.client = AsyncIOMotorClient(settings.mongodb_url)
        await self.client.admin.command("ping")

    async def close(self) -> None:
        if self.client:
            self.client.close()
            self.client = None

    def database(self) -> AsyncIOMotorDatabase:
        if self.client is None:
            raise RuntimeError("MongoDB is not connected")
        return self.client[get_settings().mongodb_database]


mongodb = MongoDB()


def get_database() -> AsyncIOMotorDatabase:
    return mongodb.database()

