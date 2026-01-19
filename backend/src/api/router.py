from fastapi import APIRouter
from src.api.endpoints.test import router as test_router
from src.api.endpoints.groups import router as groups_router

router = APIRouter()
router.include_router(test_router, tags=["health"])
router.include_router(groups_router, prefix="/groups", tags=["groups"])
