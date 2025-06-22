from extensions import db
from enum import Enum

class OrderStatus(Enum):
    PENDING ='Pending'
    SHIPPED = 'Shipped'
    DELIVERED = 'Delivered'
    CANCELLED = 'Cancelled'

class PaymentStatus(Enum):
    SUCCESS = 'Success'
    FAILED = 'Failed'
    PENDING = 'Pending'
    COMPLETED = 'Completed'
    REFUNDED = 'Refunded'
    EXPIRED = 'Expired'
    CAPTURED = 'Captured'

class DiscountType(Enum):
    REGULAR = 'Regular'
    PERCENTAGE = 'Percentage'
    FIXED = 'Fixed'

class ShippingStatus(Enum):
    PENDING ='Pending'
    SHIPPED = 'Shipped'
    DELIVERED = 'Delivered'
    CANCELLED = 'Cancelled'

##################################################################################
class Admin(db.Model):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(265), nullable=False)

    def __repr__(self):
        return f'<Admin {self.username}>'    
##############################################################################################
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)


    #Relationships mapping the user to the review
    reviews = db.relationship('Review', back_populates="user")
    #Relationships mapping the user to the orders
    orders = db.relationship('Order', back_populates="user")
    #Relationships mapping the user to the cart
    shopping_cart = db.relationship('ShoppingCart',uselist=False, back_populates="user")
    #Relationships mapping the user to multiple payment methods
    payment_method = db.relationship('PaymentMethod', back_populates="user")
    #Relationship mapping the user to multiple wishlists
    wishlists = db.relationship('Wishlist', back_populates="user")

    def __repr__(self):
        return f'<User {self.username}>'



#####################################################################################################################################################


class Category(db.Model):
    __tablename__ = 'categories'

    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String(100), nullable=False, unique=True )
    category_description = db.Column(db.Text, nullable=False)

    #Relationship mapping the categories to products
    products = db.relationship('Product', back_populates="category" )

###############################################################################################################################################


class Product(db.Model):
    """Product Table"""
    __tablename__ = 'products'

    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name= db.Column(db.String(150), nullable=False, unique=True)
    product_description = db.Column(db.Text, nullable=False)
    product_price = db.Column(db.Float, nullable = False)
    stock_quantity = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    #Foreign Key To store categories id
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'))
    #Relationship mapping the product to the related categories
    category = db.relationship('Category', back_populates="products")
    #Relationships mapping the product to multiple reviews
    reviews = db.relationship('Review', back_populates="product")
    #Relationship mapping products to multiple order items
    order_items = db.relationship('OrderItem', back_populates="product")
    # Relationship with ProductImage
    images = db.relationship('ProductImage', back_populates='product', cascade='all, delete-orphan')



#####################################################################################################################################################################################

class Order(db.Model):
    __tablename__ = 'orders'

    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_date = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    total_amount = db.Column(db.Float, nullable=False)
    order_status = db.Column(db.Enum(OrderStatus, name="order_status"), default=OrderStatus.PENDING, nullable=False)
    shipping_address = db.Column(db.Text, nullable=False)


    #Foreign Key To store user id
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    #Relationship mapping the order to the related user
    user = db.relationship('User', back_populates="orders")
    #Relationships mapping the order to multiple order items
    order_items = db.relationship('OrderItem', back_populates="order")
    #Relationship to map the order to the payment
    payment = db.relationship('Payment', uselist=False, back_populates="order")
    
    


##############################################################################################################################################################################

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    order_item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    quantity = db.Column(db.Integer, default=1)
    price = db.Column(db.String(100), nullable=False)
    discount = db.Column(db.String(100))
    shipping_cost = db.Column(db.String(100))
    tax = db.Column(db.String(100))
    discount_type = db.Column(db.Enum(DiscountType, name="discount_type"), default=DiscountType.REGULAR)
    shipping_status = db.Column(db.Enum(ShippingStatus, name="shipping_status"), default=ShippingStatus.PENDING, nullable=False)
    

    #Foreign Key To store order id
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    #Foreign key to store a product d
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    #Relationship mapping the order item to the related order
    order = db.relationship('Order', back_populates="order_items")
    #Relationship mapping the order item to the related product
    product = db.relationship('Product', back_populates="order_items")
    


################################################################################################################################################################################################


class Payment(db.Model):
    __tablename__ = 'payments'

    payment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    payment_amount = db.Column(db.String(100), nullable=False)
    transaction_id = db.Column(db.String(100),unique=True, nullable=False)
    payment_status = db.Column(db.Enum(PaymentStatus, name="payment_status"), default=PaymentStatus.PENDING, nullable=False)
    payment_date = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    #Foreign key to store order id
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    #Foreign key to store payment method id
    payment_method_id = db.Column(db.Integer, db.ForeignKey('payment_methods.payment_method_id'), nullable=False)
    #Relationship mapping the payment to the related order
    order = db.relationship('Order', back_populates="payment")
    #Relationship mapping the payment to the related payment method
    payment_method = db.relationship('PaymentMethod', back_populates="payment")



####################################################################################################################################################################
class PaymentMethod(db.Model):
    __tablename__ = 'payment_methods'

    payment_method_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    card_type = db.Column(db.String(50), nullable=False)
    card_number = db.Column(db.String(50), nullable=False)
    expiration_date = db.Column(db.String(10), nullable=False)
    security_code = db.Column(db.String(5), nullable=False)
    billing_address = db.Column(db.Text, nullable=False)

    #Foreign Key To store user id
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    #Relationship mapping the payment method to the related user
    user = db.relationship('User', back_populates="payment_method")
    #Relationships mapping the payment method to multiple payments
    payment = db.relationship('Payment', back_populates="payment_method")

################################################################################################################################################################################

class ShoppingCart(db.Model):
    __tablename__ ='shopping_carts'


    shopping_cart_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shopping_quantity = db.Column(db.Integer, default=1)
    total_price = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    #Foreign Key To store user id
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    

    #Relationship mapping the shopping cart to the related user
    user = db.relationship('User', back_populates="shopping_cart")
    #Relationships mapping the shopping cart to multiple cart items
    cart_items = db.relationship('CartItem', back_populates="shopping_cart")

##########################################################################################################################################################################

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    cart_item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    price = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    added_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())


    #Foreign Key To store shopping cart id
    shopping_cart_id = db.Column(db.Integer, db.ForeignKey('shopping_carts.shopping_cart_id'), nullable=False)
    #Relationship mapping the cart item to the related shopping cart
    shopping_cart = db.relationship('ShoppingCart', back_populates="cart_items")
    
    




######################################################################################################################################################################################
class Review(db.Model):
    __tablename__ ='reviews'
    
    review_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    #Foreign key to store user id 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),nullable=False)
    #Foreign key to store product id
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)

    #Relationship mapping the review to the related user
    user = db.relationship('User', back_populates="reviews")
    #Relationship mapping the review to the related product
    product = db.relationship('Product', back_populates="reviews")


########################################################################################################################################################################################
class Wishlist(db.Model):
    __tablename__ ='wishlists'
    
    wishlist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    #Foreign key to store user id
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    #Relationship mapping the wishlist to the related user
    user = db.relationship('User', back_populates="wishlists")
    


####################################################################################################################################################

#########################################################################################################################################################################
class Promotion(db.Model):
    __tablename__ ='promotions'

    promotion_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    promotion_code = db.Column(db.String(50),unique=True, nullable=False)
    discount_type = db.Column(db.Enum(DiscountType, name="discount_type_enum"), default=DiscountType.PERCENTAGE, nullable=False)
    discount_value = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

###############################################################################################################################################################################

class ProductImage(db.Model):
    """Product Images Table"""
    __tablename__ = 'product_images'

    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image_url = db.Column(db.String(200), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    # Foreign Key to associate images with a product
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)

    # Relationship mapping images to a product
    product = db.relationship('Product', back_populates='images')

###########################################################################################################################################################
class ShippingInformation(db.Model):
    __tablename__ ='shipping_information'

    shipping_info_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shipping_address = db.Column(db.Text, nullable=False)
    shipping_method = db.Column(db.String(50), nullable=False)
    tracking_number = db.Column(db.String(100),unique=True, nullable=False)
    estimated_delivery = db.Column(db.DateTime, nullable=True)
    actual_delivery = db.Column(db.DateTime, nullable=True)
    shipping_status = db.Column(db.Enum(ShippingStatus, name="shipping_status"), default=ShippingStatus.PENDING, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

###################################################################################################################################################################################################

class BillingInformation(db.Model):
    __tablename__ = 'billing_information'

    billing_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    company_name = db.Column(db.String(100))
    country = db.Column(db.String(100), nullable=False)
    street_address = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    province = db.Column(db.String(100), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    additional_info = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

###################################################################################################################################################################

class NewsletterSubscriber(db.Model):

    __tablename__ = 'newsletter_subscribers'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    subscribed_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(200))
    token_expires_at = db.Column(db.DateTime)
    ip_address = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default=True)
        
class BlogPost(db.Model):
    
    __tablename__ = 'blog_posts'

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())


class BlogImage(db.Model):
    """Blog Images Table"""
    __tablename__ = 'Blog_images'

    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    filename = db.Column(db.String(200), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())    
