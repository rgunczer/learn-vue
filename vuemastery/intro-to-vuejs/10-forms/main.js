Vue.component('test', {
    props: {
        message: {
            type: String,
            required: true,
            default: "Hi"
        }
    },
    template: `<h1>I'm a component {{ message }}</h1>`,
    data() {
        return {

        };
    }
});

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
        </p>



        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name">
        </p>

        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>

        <input type="submit" value="Submit">

    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        };
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                };

                this.$emit('review-submitted', productReview);

                this.name = null;
                this.review = null;
                this.rating = null;
            } else {
                if (!this.name) {
                    this.errors.push("Name required");
                }
                if (!this.review) {
                    this.errors.push("Review required");
                }
                if (!this.rating) {
                    this.errors.push("Rating required");
                }
            }
        }
    }
});

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image">
            </div>

            <div class="product-info">
                <h1 :style="[styleObject, styleObject2]">{{ title }}</h1>
                <h1 :style="[styleObject, styleObject2]">{{ onSaleTitle }}</h1>

                <p v-if="inStock">In Stock</p>
                <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
                <p>User is premium: {{ premium }}</p>
                <p>Shipping: {{ shipping }}</p>

                <ul>
                    <li v-for="detail in details">
                        {{ detail }}
                    </li>
                </ul>

                <div v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)">
                </div>

                <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to Cart</button>
                <button @click="removeFromCart">Remove from Cart</button>

                <div>
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul>
                        <li v-for="review in reviews">
                            <p>{{review.name}}</p>
                            <p>Rating: {{review.rating}}</p>
                            <p>{{review.review}}</p>
                        </li>
                    </ul>
                </div>

                <product-review @review-submitted="addReview"></product-review>

            </div>
        </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            onSale: true,
            selectedVariant: 0,
            details: ["80% cotton", "20% polyester", "Gender neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './assets/vmSocks-green.jpg',
                    variantQuantity: 1
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: './assets/vmSocks-blue.jpg',
                    variantQuantity: 0
                }
            ],
            color: 'blue',
            fontSize: '13px',
            styleObject: {
                color: 'red',
                fontSize: '23px',
            },
            styleObject2: {
                margin: '5px',
                padding: '20px',
            },
            reviews: []
        };
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.reviews.push(productReview);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        onSaleTitle() {
            return this.onSale ? this.brand + ' ' + this.product : '';
        },
        shipping() {
            if (this.premium) {
                return "Free";
            }
            return 2.99;
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        updateCartRemove(id) {
            const pos = this.cart.indexOf(id);
            this.cart.splice(pos, 1);
        }
    }
});
