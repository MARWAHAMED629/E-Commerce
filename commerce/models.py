from django.db import models
from django.utils.html import format_html

from accounts.models import UserAccount

# Create your models here.

class Categories(models.Model):
    language = [
        ('AR','AR'),
        ('EN','EN'),
    ]

    name = models.CharField(max_length=700, unique=True, verbose_name="أسم الفئه")
    languages = models.CharField(max_length=50, choices=language, verbose_name="اللغه")
    first_image = models.ImageField(upload_to="media/images/", verbose_name="الصوره")
    date = models.DateTimeField(auto_now_add=True, verbose_name="التاريخ")
    is_active = models.BooleanField(default=True, verbose_name="حالة الفئه")

    def category_image(self):
        return format_html('<img src="{}" width="100">'.format(self.first_image.url))
    category_image.short_discription = "show images"
    first_image.allow_tags = True

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["-date"]
        verbose_name="فئه"
        verbose_name_plural = "الفئات"



# ______________________________________________________
class Product(models.Model):
    language = [
        ('AR','AR'),
        ('EN','EN'),
    ]
    
    name = models.CharField(max_length=255, unique=True, verbose_name="اسم المنتج")
    languages = models.CharField(max_length=50, choices=language, verbose_name="اللغه")
    category = models.ForeignKey(Categories, on_delete=models.CASCADE, related_name="product", verbose_name="الفئه")
    price = models.DecimalField(max_digits=7, decimal_places=2, verbose_name="السعر")
    price_vat = models.DecimalField(max_digits=7, decimal_places=2, default=15, verbose_name="قيمة الضريبه")
    first_image = models.ImageField(upload_to="media/images/", blank=False, verbose_name="الصوره الأولى واذا كنت ستضيف كارت شحن اختر الصوره الأولى فقط")
    second_image = models.ImageField(upload_to="media/images/", blank=True, verbose_name="الصوره الثانيه")
    third_image = models.ImageField(upload_to="media/images/", blank=True, verbose_name="الصوره الثالثه")
    fourth_image = models.ImageField(upload_to="media/images/", blank=True, verbose_name="الصوره الرابعه")
    date = models.DateTimeField(auto_now_add=True, verbose_name="التاريخ")
    is_active = models.BooleanField(default=True, verbose_name="حالة المنتج")
    item_type = models.CharField(max_length=10, choices=[('product', 'product')], verbose_name="النوع")



    def product_image(self):
        return format_html('<img src="{}" width="100">'.format(self.first_image.url))
    product_image.short_discription = "show images"
    first_image.allow_tags = True

    def __str__(self):
        return self.name
    
    def vat_calculate(self):
        # return (self.price + self.price * self.price_vat / 100)
        return f"{self.price + self.price * self.price_vat / 100:.2f}"

    class Meta:
        ordering = ["-date"]
        verbose_name="منتج"
        verbose_name_plural = "المنتجات"

# _____________________________________________
class Promotion(models.Model):
    language = [
        ('AR','AR'),
        ('EN','EN'),
    ]
    
    name = models.CharField(max_length=255, unique=True, verbose_name="اسم العرض")
    languages = models.CharField(max_length=50, choices=language, verbose_name="اللغه")
    # category = models.ForeignKey(Categories, on_delete=models.CASCADE, related_name="product")
    old_price = models.DecimalField(max_digits=7, decimal_places=2, verbose_name="السعر القديم")
    new_price = models.DecimalField(max_digits=7, decimal_places=2, default=15, verbose_name="السعر الجديد")
    first_image = models.ImageField(upload_to="media/images/", blank=False, verbose_name="الصوره الأولى")
    second_image = models.ImageField(upload_to="media/images/", blank=True, verbose_name="الصوره الثانيه")
    third_image = models.ImageField(upload_to="media/images/", blank=True, verbose_name="الصوره الثالثه")
    fourth_image = models.ImageField(upload_to="media/images/", blank=True, verbose_name="الصوره الرابعه")
    date = models.DateTimeField(auto_now_add=True, verbose_name="التاريخ")
    is_active = models.BooleanField(default=True, verbose_name="حالة المنتج")
    item_type = models.CharField(max_length=10, choices=[('promotion', 'promotion')], verbose_name="النوع")



    def promotion_image(self):
        return format_html('<img src="{}" width="100">'.format(self.first_image.url))
    promotion_image.short_discription = "show images"
    first_image.allow_tags = True

    def __str__(self):
        return self.name
    
    # def vat_calculate(self):
    #     # return (self.price + self.price * self.price_vat / 100)
    #     return f"{self.price + self.price * self.price_vat / 100:.2f}"

    class Meta:
        ordering = ["-date"]
        verbose_name="عرض"
        verbose_name_plural = "العروض"

# _________________________________________


class Orders(models.Model):
    user_id = models.CharField(max_length=255, blank=False, verbose_name="حساب المستخدم" )
    product = models.ForeignKey(Product,blank=True,null=True, related_name='orders', on_delete=models.CASCADE, verbose_name="المنتج")
    promotion = models.ForeignKey(Promotion,blank=True,null=True, related_name='promotion', on_delete=models.CASCADE, verbose_name="العرض")
    date_ordered = models.DateTimeField(auto_now_add=True, verbose_name="تاريخ اضافته في السله")
    complete = models.BooleanField(default=False, verbose_name="الحاله")
    qty = models.IntegerField(default=1, verbose_name="الكميه")
    item_type = models.CharField(max_length=10, choices=[('product', 'product'), ('promotion', 'promotion')], verbose_name="النوع")


    def __str__(self):
        if self.product:

            return self.product.name
        else:
            return self.promotion.name
        
   
    def totalPrice(self):
        if self.product:

            return (self.product.price + self.product.price * self.product.price_vat / 100) * self.qty
        else:
            return self.promotion.new_price *  self.qty


    class Meta:
        verbose_name="طلب"
        verbose_name_plural = "الطلبات"


class ShippingAddress(models.Model):
    user_id = models.CharField(max_length=255, blank=False, verbose_name="حساب المستخدم")
    customer_name = models.CharField(max_length=200, blank=False, verbose_name="أسم العميل")
    # order = models.ManyToManyField(Orders, related_name="orders", verbose_name="الطلب")
    order = models.ManyToManyField(Orders, related_name="orders", verbose_name="الطلب")
   
   
    phone = models.CharField(max_length=100,blank=False, verbose_name="رقم الهاتف")
    address = models.CharField(max_length=200, blank=False, verbose_name="العنوان")
    state = models.CharField(max_length=200, blank=False, verbose_name="المنطقه")
    created = models.DateTimeField(auto_now_add=True, verbose_name="تاريخ الشراء")
    payment_status = models.BooleanField(default=True, verbose_name="حالة الدفع")

    def __str__(self):
        return self.customer_name
    
   
    
    class Meta:
        verbose_name="شراء"
        verbose_name_plural = "عمليات الشراء"
    
        
        