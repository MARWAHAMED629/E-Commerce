from dataclasses import fields
from rest_framework import serializers
from commerce.models import Product, ShippingAddress, Categories, Orders, Promotion


class CategorySerializers(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ['id','languages', 'name', 'first_image', "is_active"]



class ProductSerializers(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ["id","name","languages","category","price","price_vat","vat_calculate","first_image","second_image","third_image","fourth_image","is_active","item_type"]
    def to_representation(self, instance):
            data = super().to_representation(instance)
            data["category"] = CategorySerializers(instance.category).data
            return data


class PromotionSerializers(serializers.ModelSerializer):

    class Meta:
        model = Promotion
        fields = ["id","name","languages","old_price","new_price","first_image","second_image","third_image","fourth_image","is_active","item_type"]
    # def to_representation(self, instance):
    #         data = super().to_representation(instance)
    #         data["category"] = CategorySerializers(instance.category).data
    #         return data



class OrdersSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Orders
        fields = ["id","user_id","product","promotion","date_ordered","item_type","complete","qty", "totalPrice"]
        read_only_fields = ['id']


    def to_representation(self, instance):
            data = super().to_representation(instance)
            data["product"] = ProductSerializers(instance.product).data
            data["promotion"] = PromotionSerializers(instance.promotion).data
            return data





class ShippingAddressSerializers(serializers.ModelSerializer):
    # order = OrdersSerializers(many=True)
    class Meta:
        model = ShippingAddress
        fields = ["id","user_id","customer_name","order","phone","address","state","created","payment_status"]
       
        # def to_representation(self, instance):
        #     data = super().to_representation(instance)
        #     data["order"] = OrdersSerializers(instance.order['product']).data
        #     return data
