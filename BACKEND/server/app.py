from flask import Flask, send_from_directory, make_response
from config import Config
from flask_cors import CORS
from extensions import db, migrate, jwt
from models import User
from routes.users_route import users_bp
from routes.products_route import product_bp
from routes.productImage_route import product_image_bp
from routes.billing_route import billing_bp
from routes.category_route import category_bp

from routes.blog_route import blog_bp
from routes.cart_route import cart_bp
from routes.order_route import order_bp
from routes.payment_route import payment_bp
from routes.payment_methods import payment_methods_bp
from routes.social_media_route import social_media_bp
#from routes.stripe_route import stripe_bp

import os

app = Flask(__name__)

app.config.from_object(Config)

CORS(app)
db.init_app(app)
migrate.init_app(app, db)
jwt.init_app(app)




#Create a Route

@app.route('/')
def home():
    return 'Hello, World!'

  

#Register all blueprints

app.register_blueprint(users_bp,url_prefix = '/auth')
app.register_blueprint(product_image_bp,url_prefix = '/productimages')
app.register_blueprint(product_bp,url_prefix = '/api')
app.register_blueprint(billing_bp, url_prefix = '/billing')
app.register_blueprint(category_bp,url_prefix = '/categories')

app.register_blueprint(blog_bp, url_prefix = '/blog')
app.register_blueprint(cart_bp, url_prefix = '/cart')
app.register_blueprint(order_bp, url_prefix = '/orders')

# Register all payment blueprints
app.register_blueprint(payment_bp, url_prefix = '/payments')
app.register_blueprint(payment_methods_bp, url_prefix = '/methods')
app.register_blueprint(social_media_bp, url_prefix = '/social')
 # app.register_blueprint(stripe_bp, url_prefix = '/stripe')

if __name__ == '__main__':
    app.run(debug=True, port=5000)