from fastapi import APIRouter, HTTPException, status

router = APIRouter(prefix="/forecasts", tags=["AI Demand Forecasting"])

_NOT_IMPLEMENTED = "AI demand forecasting is not implemented yet."


@router.get("")
async def list_forecasts():
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=_NOT_IMPLEMENTED)


@router.post("/predict")
async def predict_demand():
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=_NOT_IMPLEMENTED)


@router.post("/train")
async def train_model():
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=_NOT_IMPLEMENTED)
