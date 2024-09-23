from django.shortcuts import render
from rest_framework import viewsets, filters, pagination
from commerce.models import Product, ShippingAddress, Categories, Orders, Promotion
from commerce.serializers import ProductSerializers, OrdersSerializers,ShippingAddressSerializers, CategorySerializers, PromotionSerializers
# from rest_framework.authentication import TokenAuthentication

# import django_filters.rest_framework
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import filters

# import UserAccount from accounts.models
from accounts.models import UserAccount
from accounts.serializers import UserCreateserializer

# from rest_framework.authentication import TokenAuthentication
# from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly


# Create your views here.
class ProductPagination(pagination.PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 1000



class CategoryViewSets(viewsets.ModelViewSet):
    # queryset = Categories.objects.all()
    queryset = Categories.objects.filter(is_active=True)
    serializer_class = CategorySerializers
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name','id','languages']  #http://127.0.0.1:8000/api/products/?name=iphone
    search_fields = ['name'] #http://127.0.0.1:8000/api/products/?search=dell   just write any char in name no need full name




class ProductViewSets(viewsets.ModelViewSet):
    # queryset = Product.objects.all()
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializers
    # pagination_class = ProductPagination
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name','category__id','id','languages']  #http://127.0.0.1:8000/api/products/?category=1    http://127.0.0.1:8000/api/products/?languages=EN
    # search_fields = ['name','languages','category']
    search_fields = ['name']


class PromotionViewSets(viewsets.ModelViewSet):
    # queryset = Product.objects.all()
    queryset = Promotion.objects.filter(is_active=True)
    serializer_class = PromotionSerializers
    # pagination_class = ProductPagination
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name','id','languages']  #http://127.0.0.1:8000/api/products/?category=1    http://127.0.0.1:8000/api/products/?languages=EN
    # search_fields = ['name','languages','category']
    search_fields = ['name']



class OrdersViewSets(viewsets.ModelViewSet):
    # queryset = Orders.objects.all()
    queryset = Orders.objects.filter(complete=False)
    serializer_class = OrdersSerializers
    # permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['id','user_id','product','product__id', 'promotion__id']
    search_fields = ['id','user_id']




class ShippingViewSets(viewsets.ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializers
    # permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['customer_name','phone','id','order','user_id']
    search_fields = ['customer_name','phone','id','order','user_id']





# ______________________Send Email_________________________________
from django.core.mail import send_mail
from django.core.mail import EmailMessage

from django.conf import settings
from django.http import JsonResponse




def send(request, customerName, phoneNumber, subject):
    try:

        send_mail('Customer Message', f'Name: {customerName}\n\n Phone: {phoneNumber}\n\n Subject: {subject}', settings.EMAIL_HOST_USER, ['arfsociety07@gmail.com'])
        # return JsonResponse(res, safe=False)
        return JsonResponse({'status': 'success', 'message': 'Email Sent Successfully'})
    except Exception as e:
    
        return JsonResponse({'status': 'error', 'message': f'Error Sending Email Check Connection '})
    


# ______________________Send Email With Products Details_________________________________
from django.core.mail import EmailMessage
import json

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def sendProductsDetails(request):
   
    data = request.data.get('data', None) # البيانات من Angular
    client_name = request.data.get('client_name', None)
    client_phone = request.data.get('client_phone', None)
    addressCash = request.data.get('addressCash', None)
    regionCash = request.data.get('regionCash', None)
    totalPriceInvoice = request.data.get('totalPriceInvoice', None)
    paymentMethod = request.data.get('paymentMethod', None)
    emailAddress = request.data.get('emailAddress', None)
    # email_body = f'العميل: {client_name}\nرقم الهاتف: {client_phone}\n\n'
    email_body = f'اسم العميل: {client_name}\n\nرقم الهاتف: {client_phone}\n\nالعنوان: {addressCash}\n\nالمنطقة: {regionCash}\n\nاجمالي الفاتوره: {totalPriceInvoice}\n\nطريقة الدفع: {paymentMethod}\n\n'
    




    # for item in data:
    #        email_body += f'اسم: {item["name"]}, السعر: {item["totalItem"]}, الكمية: {item["qty"]}\n'
    if data is not None:
        email_body+=  "\n".join([f"اسم المنتج: {item['name']}, السعر: {item['totalItem']},الكمية: {item['qty']}\n" for item in data])
    send_mail(
           'شراء منتج جديد',
           email_body,
           settings.EMAIL_HOST_USER,
             ['arfsociety07@gmail.com',emailAddress],
             fail_silently=False,
          
    )
    
    return Response({'message': 'تم إرسال البريد الإلكتروني بنجاح'})
    





# from django.views.decorators.csrf import csrf_exempt

# @csrf_exempt
# def sendProductsDetails(request):
#     if request.method == 'POST':
#         data = request.POST
#         name = data.get('name')
#         qty = data.get('qty')
#         totalPrice = data.get('totalPrice')
        
       
#         send_mail(
#             'عنوان البريد الإلكتروني',
#             f'Customer Name: {name}, Quantity: {qty}, Total Price For Quantity: {totalPrice}',
#             settings.EMAIL_HOST_USER,
#             ['arfsociety07@gmail.com'],
#             fail_silently=False,
#         )
        
#         return JsonResponse({'message': 'تم إرسال البريد الإلكتروني بنجاح'})
#     else:
#         return JsonResponse({'message': 'طلب غير صالح'}, status=400)

