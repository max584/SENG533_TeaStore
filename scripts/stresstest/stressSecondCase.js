import { group, sleep, check } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8080/tools.descartes.teastore.webui';  // Change here when needed

export let options = {
    stages: [
        { duration: '30s', target: 50 },
        { duration: '60s', target: 50 },
        { duration: '30s', target: 100 },
        { duration: '60s', target: 100 },
        { duration: '30s', target: 0 },
    ],
};

export default function () {
    let loginRes = http.post(`${BASE_URL}/loginAction`, {
        referer: `${BASE_URL}/login`,
        username: 'user21',
        password: 'password',
        signin: 'Sign in',
    });
    check(loginRes, { 'login status 302': (r) => r.status === 302 });

    let homeRes = http.get(`${BASE_URL}/`);
    check(homeRes, { 'home status 200': (r) => r.status === 200 });

    let categoryPage = http.get(`${BASE_URL}/category?category=2&page=1`);
    check(categoryPage, { 'category page 200': (r) => r.status === 200 });

    let changeCategory = http.post(`${BASE_URL}/category?category=2&page=1`, {
        category: '2',
        page: '1',
        number: '3',
    });
    check(changeCategory, { 'change category 302': (r) => r.status === 302 });

    let newCategoryPage = http.get(`${BASE_URL}/category?category=2&page=1`);
    check(newCategoryPage, { 'new category page 200': (r) => r.status === 200 });

    let nextCategoryPage = http.get(`${BASE_URL}/category?category=2&page=2`);
    check(nextCategoryPage, { 'next category page 200': (r) => r.status === 200 });

    let addToCartRes = http.post(`${BASE_URL}/cartAction`, {
        productid: '55',
        addToCart: 'Add to Cart',
    });
    check(addToCartRes, { 'add to cart 302': (r) => r.status === 302 });

    let cartRes = http.get(`${BASE_URL}/cart`);
    check(cartRes, { 'cart view 200': (r) => r.status === 200 });

    let updateCartRes = http.post(`${BASE_URL}/cartAction`, {
        productid: '55',
        orderitem_7: '24',
        updateCartQuantities: 'Update Cart',
    });
    check(updateCartRes, { 'update cart 302': (r) => r.status === 302 });

    let cartRes1 = http.get(`${BASE_URL}/cart`);
    check(cartRes1, { 'updated cart 200': (r) => r.status === 200 });

    let addExtraToCart = http.post(`${BASE_URL}/cartAction`, {
        productid: '47',
        addToCart: 'Add to Cart',
    });
    check(addExtraToCart, { 'extra cart 302': (r) => r.status === 302 });

    let cartRes2 = http.get(`${BASE_URL}/cart`);
    check(cartRes2, { 'extra cart view 200': (r) => r.status === 200 });

    let removeExtra = http.post(`${BASE_URL}/cartAction`, {
        productid: '55',
        orderitem_7: '24',
        productid: '47',
        orderitem_47: '1',
        removeProduct_47: '',
    });
    check(removeExtra, { 'remove product 302': (r) => r.status === 302 });

    let cartRes3 = http.get(`${BASE_URL}/cart`);
    check(cartRes3, { 'final cart 200': (r) => r.status === 200 });

    let proceedCheckout = http.post(`${BASE_URL}/cartAction`, {
        productid: '55',
        orderitem_7: '24',
        proceedtoCheckout: 'Proceed to Checkout',
    });
    check(proceedCheckout, { 'proceed checkout 302': (r) => r.status === 302 });

    let orderRes = http.get(`${BASE_URL}/order`);
    check(orderRes, { 'order page 200': (r) => r.status === 200 });

    let orderSubmit = http.post(`${BASE_URL}/cartAction`, {
        firstname: 'Jon',
        lastname: 'Snow',
        address1: 'Winterfell',
        address2: '11111 The North, Westeros',
        cardtype: 'saab',
        cardnumber: '314159265359',
        expirydate: '12/2025',
        confirm: 'Confirm',
    });
    check(orderSubmit, { 'order submit 302': (r) => r.status === 302 });

    sleep(1);
}
