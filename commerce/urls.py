# from ast import Import
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from .views import ProductViewSets, OrdersViewSets,ShippingViewSets , CategoryViewSets, sendProductsDetails, send, PromotionViewSets
router = DefaultRouter()

router.register('categories', CategoryViewSets, basename='categories')
router.register('products', ProductViewSets, basename='products')
router.register('promotion', PromotionViewSets, basename='promotion')
router.register('cart', OrdersViewSets, basename='cart')
router.register('ship', ShippingViewSets, basename='ship')


urlpatterns = [
path('api/', include(router.urls)),


# path('send/<str:customerName>/<str:phoneNumber>/<str:subject>', send, name="send"),
path('send/<str:customerName>/<str:phoneNumber>/<str:subject>', send, name="send"),
path('sendwithproducts/', sendProductsDetails, name="sendwithproducts")





]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)