import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app)

# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Float)
    category = db.Column(db.String(50))
    brand = db.Column(db.String(50))
    image = db.Column(db.String(200))
    discount = db.Column(db.Integer)
    is_new = db.Column(db.Boolean)

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer) 
    product_id = db.Column(db.Integer)
    quantity = db.Column(db.Integer)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    user_name = db.Column(db.String(100))
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.datetime.utcnow)

with app.app_context():
    db.create_all()

with app.app_context():
    if Product.query.count() == 0:
        sample_products = [
            # Exclusive Launch Products
            {"name":"Moi Cherry Bomb Long-Lasting Eau De Parfum For Women (Sweet, Juicy, Gourmand, Smoky, Day+Night)","price":764,"category":"Perfume","brand":"Nykaa Perfumes","image":"https://images-static.nykaa.com/media/catalog/product/9/5/954f57bNYKAF00000028_3.jpg?tr=w-500","discount":15,"is_new":True},
            {"name":"Moi Caramel Eclair Long-Lasting Eau De Parfum For Women (Sweet, Hazelnut, Gourmand, Day+Night)","price":764,"category":"Perfume","brand":"Nykaa Perfumes","image":"https://preview.redd.it/nykaa-perfume-caramel-v0-cna0heku3nvf1.jpeg?width=1080&crop=smart&auto=webp&s=1cf1de294c1932daeedb57dc8738f97daad718dd","discount":15,"is_new":True},
            {"name":"Moi Vanilla Drip Long-Lasting Eau De Parfum For Women (Sweet, Pear, Gourmand, Cake, Day+Night)","price":764,"category":"Perfume","brand":"Nykaa Perfumes","image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYr8YyWQFzC9fIfsSdiwj1PCPMGYn2p9mPhA&s","discount":15,"is_new":True},

            # Kay Beauty Products
            {"name":"Kay Beauty Soft Matte Pressed Powder","price":1199,"category":"Makeup","brand":"Kay Beauty","image":"https://www.kaybeauty.com/cdn/shop/files/1_769e4770-5432-4744-b0d5-ab817644bd33.jpg?v=1759927864","discount":22,"is_new":False},
            {"name":"Kay Beauty Hydra Creme Lipstick","price":919,"category":"Makeup","brand":"Kay Beauty","image":"https://images-static.naikaa.com/beauty-blog/wp-content/uploads/2024/07/kay-beauty-Product.jpg","discount":15,"is_new":True},
            
            # Dot & Key Products
            {"name":"Dot & Key Vitamin C Daily Glow Booster Combo | Facewash 80ml, Serum 30ml, Moisturizer 60ml & Sunscreen 50gm","price":1884,"category":"Skincare","brand":"Dot & Key","image":"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS6hXAESjAta4igVnky1Xkv8V7SuSp1dGq8JOXtNctI78D-yNZsnzS8gwJI9w","discount":19,"is_new":False},
            {"name":"Dot & Key Super Cica & Salicylic Anti Acne Routine","price":1788,"category":"Skincare","brand":"Dot & Key","image":"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRP219rfc4R0-kB5Mh78mlry5hunlfA-jMhTyQi4Pr6tJrEEPXEydLosgn0cg","discount":21,"is_new":True},
            {"name":"Dot & Key Healthy Hydration Skincare Combo","price":1185,"category":"Skincare","brand":"Dot & Key","image":"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQPWd41w8Jqmp6_olPXyi6NUfGu0R7QqAFLwZJoj8_OPfw857gMHHrU_v4c1mg","discount":30,"is_new":True}
        ]
       
        
        try:
            for p in sample_products:
                product = Product(**p)
                db.session.add(product)
                print(f"Adding product: {p['name']}") 
            db.session.commit()
            print(f"Successfully added {len(sample_products)} products") 
        except Exception as e:
            print(f"Error adding products: {e}") 
            db.session.rollback()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated


@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "User already exists"}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        first_name=data['firstName'],
        last_name=data.get('lastName', ''),
        email=data['email'],
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    

    token = jwt.encode({
        'user_id': new_user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'])
    
    return jsonify({
        "message": "User created successfully",
        "token": token,
        "user": {
            "id": new_user.id,
            "firstName": new_user.first_name,
            "lastName": new_user.last_name,
            "email": new_user.email
        }
    })


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    print(f"=== LOGIN ATTEMPT ===")
    print(f"Received data: {data}")
    
    if not data or 'email' not in data or 'password' not in data:
        print("Missing email or password in request")
        return jsonify({"message": "Email and password are required"}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    print(f"User found: {user is not None}")
    
    if not user:
        print(f"No user found with email: {data['email']}")
        return jsonify({"message": "User not verified"}), 401
    
    print(f"User details - ID: {user.id}, Email: {user.email}, Name: {user.first_name}")
    print(f"Stored password hash: {user.password}")
    print(f"Provided password: {data['password']}")
    

    password_valid = check_password_hash(user.password, data['password'])
    print(f"Password valid: {password_valid}")
    
    if not password_valid:
        print("Password does not match")
        return jsonify({"message": "Invalid credentials"}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'])
    
    print("Login successful, generating token")
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "email": user.email
        }
    })

@app.route("/api/profile", methods=["GET"])
@token_required
def get_profile(current_user):
    return jsonify({
        "id": current_user.id,
        "firstName": current_user.first_name,
        "lastName": current_user.last_name,
        "email": current_user.email
    })

@app.route("/api/cart", methods=["GET", "POST"])
@token_required
def handle_cart(current_user):
    if request.method == "POST":
        try:
            data = request.json
            print(f"Received cart data: {data}") 
            
            existing_item = Cart.query.filter_by(
                user_id=current_user.id, 
                product_id=data['product_id']  
            ).first()
            
            if existing_item:
                existing_item.quantity += data.get('quantity', 1)
                message = "Cart item quantity updated"
            else:
                cart_item = Cart(
                    user_id=current_user.id,
                    product_id=data['product_id'],  
                    quantity=data.get('quantity', 1)
                )
                db.session.add(cart_item)
                message = "Added to cart successfully"
            
            db.session.commit()
            return jsonify({"message": message})
       
        except KeyError as e:
            return jsonify({"message": f"Missing field: {e}"}), 400
        except Exception as e:
            db.session.rollback()
            print(f"Cart error: {e}")
            return jsonify({"message": "Failed to add to cart"}), 500
    
    else:  
        cart_items = Cart.query.filter_by(user_id=current_user.id).all()
        result = []
        for c in cart_items:
            product = Product.query.get(c.product_id)
            if product:
                result.append({
                    "id": c.id,
                    "product_id": product.id,
                    "name": product.name,
                    "price": product.price,
                    "image": product.image,
                    "discount": product.discount,
                    "quantity": c.quantity
                })
        return jsonify(result)

@app.route("/api/cart/<int:item_id>", methods=["DELETE"])
@token_required
def remove_cart_item(current_user, item_id):
    item = Cart.query.filter_by(id=item_id, user_id=current_user.id).first()
    if item:
        db.session.delete(item)
        db.session.commit()
    return jsonify({"message": "Item removed"})

@app.route("/api/reviews", methods=["GET", "POST"])
def handle_reviews():
    if request.method == "POST":
        data = request.json
        review = Review(
            product_id=data['product_id'],
            user_id=data.get('user_id'),
            user_name=data['user_name'],
            rating=data['rating'],
            comment=data['comment']
        )
        db.session.add(review)
        db.session.commit()
        return jsonify({"message": "Review added"})
    
    else:  
        product_id = request.args.get("product_id")
        reviews = Review.query.filter_by(product_id=product_id).all()
        return jsonify([{
            "id": r.id,
            "product_id": r.product_id,
            "user_name": r.user_name,
            "rating": r.rating,
            "comment": r.comment,
            "date": r.date.isoformat()
        } for r in reviews])


@app.route("/api/products", methods=["GET"])
def get_products():
    query = Product.query
    category = request.args.get("category")
    brand = request.args.get("brand")
    sort = request.args.get("sort")
    search = request.args.get("search")

    if category:
        query = query.filter_by(category=category)
    if brand:
        query = query.filter_by(brand=brand)
    if search:
        search = f"%{search.lower()}%"
        query = query.filter(
            db.or_(db.func.lower(Product.name).like(search),
            db.func.lower(Product.brand).like(search),
            db.func.lower(Product.category).like(search)))
    if sort == "price_low":
        query = query.order_by(Product.price.asc())
    elif sort == "price_high":
        query = query.order_by(Product.price.desc())
    elif sort == "discount":
        query = query.order_by(Product.discount.desc())

    products = query.all()
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "category": p.category,
        "brand": p.brand,
        "image": p.image,
        "discount": p.discount,
        "isNew": p.is_new
    } for p in products])

@app.route("/api/debug/check-token", methods=["GET"])
def debug_check_token():
    token = request.headers.get('Authorization')
    
    if not token:
        return jsonify({"message": "No token provided"}), 401
    
    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user = User.query.get(data['user_id'])
        
        if user:
            return jsonify({
                "message": "Token is valid",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": f"{user.first_name} {user.last_name}"
                }
            })
        else:
            return jsonify({"message": "User not found"}), 401
            
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

@app.route("/api/debug/test", methods=["GET"])
def debug_test():
    return jsonify({"message": "Server is working"})

@app.route("/api/check-auth", methods=["GET"])
def check_auth():
    token = request.headers.get('Authorization')
    
    if not token:
        return jsonify({"authenticated": False, "message": "No token"})
    
    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user = User.query.get(data['user_id'])
        
        if user:
            return jsonify({
                "authenticated": True,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "firstName": user.first_name,
                    "lastName": user.last_name
                }
            })
        else:
            return jsonify({"authenticated": False, "message": "User not found"})
            
    except Exception as e:
        return jsonify({"authenticated": False, "message": str(e)})

@app.route("/api/checkout", methods=["POST"])
@token_required
def checkout(current_user):
    cart_items = Cart.query.filter_by(user_id=current_user.id).all()
    if not cart_items:
        return jsonify({"message": "Cart is empty"}), 400

    total = 0
    items_list = []
    for c in cart_items:
        p = Product.query.get(c.product_id)
        if p:
            total += p.price * c.quantity
            items_list.append({"id": p.id, "name": p.name, "quantity": c.quantity, "price": p.price})

    
    for c in cart_items:
        db.session.delete(c)
    db.session.commit()

    return jsonify({
        "message": "Order placed",
        "order": {
            "total": total,
            "items": items_list,
            "order_id": datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        }
    })

if __name__ == "__main__":
    port=int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)