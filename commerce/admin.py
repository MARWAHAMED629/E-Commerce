from django.contrib import admin
from commerce import models
# Register your models here.
from import_export.admin import ImportExportModelAdmin

admin.site.site_header = 'Marwa Hamed'
admin.site.site_title = 'Marwa Hamed'

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name","languages","category_image","is_active")


class ProductAdmin(admin.ModelAdmin):
    list_display = ("name","category","languages","price","vat_calculate", "price_vat", "product_image","is_active")


class PromotionAdmin(admin.ModelAdmin):
    list_display = ("name","languages","old_price","new_price","promotion_image","is_active")


class OrdersAdmin(admin.ModelAdmin):
    list_display = ("user_id","product","promotion","item_type","date_ordered","qty", "totalPrice","complete")


class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ("customer_name","get_order_info","phone","address","state","created","payment_status")
    search_fields = ['customer_name', 'phone']

    def get_order_info(self, obj):
        orders = obj.order.all()
        order_info = ""
        for order in orders:
            if order.product:
                order_info += f'المنتج: {order.product.name}, الكمية: {order.qty}\n'
            elif order.promotion:
                order_info += f'العرض: {order.promotion.name}, الكمية: {order.qty}\n'
        return order_info

    get_order_info.short_description = 'معلومات الطلب'

# @admin.register(models.Orders)
# class OrdersCSV(ImportExportModelAdmin, OrdersAdmin):
#     pass

@admin.register(models.Product)
class ProductCSV(ImportExportModelAdmin, ProductAdmin):
    pass

@admin.register(models.Promotion)
class PromotinCSV(ImportExportModelAdmin, PromotionAdmin):
    pass

@admin.register(models.ShippingAddress)
class ShippingCSV(ImportExportModelAdmin, ShippingAddressAdmin):
    pass

admin.site.register(models.Categories, CategoryAdmin)
# admin.site.register(models.Product, ProductAdmin)
# admin.site.register(models.Orders, OrdersAdmin)
# admin.site.register(models.ShippingAddress, ShippingAddressAdmin)


# working with ForeinKey

from import_export import resources, fields
from import_export.fields import Field

class OrdersResource(resources.ModelResource):
    product_name = Field(attribute='product__name', column_name='Product')
    promotion_name = Field(attribute='promotion__name', column_name='Promotion')
    total_price = Field(attribute='totalPrice', column_name='Total Price')
    
    def export_totalPrice(self, obj):
        return obj.totalPrice()
    
    class Meta:
        model = models.Orders
        fields = ('product_name', 'promotion_name', 'item_type', 'date_ordered', 'qty', 'total_price', 'complete')

    


class OrdersAdmin(ImportExportModelAdmin):
    resource_class = OrdersResource
    list_display = ("user_id", "product", "promotion", "item_type", "date_ordered", "qty", "totalPrice", "complete")

admin.site.register(models.Orders, OrdersAdmin)


# ______________

