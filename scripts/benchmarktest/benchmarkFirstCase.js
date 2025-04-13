import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8080/tools.descartes.teastore.webui'; // Update if needed

export let options = {
    vus: 50,
    duration: '30s', 
};

export default function () {
    let loginRes = http.post(`${BASE_URL}/loginAction`, {
        referer: `${BASE_URL}/login`,
        username: 'user2',
        password: 'password',
        signin: 'Sign in',
    });
    check(loginRes, { 'login status 302': (r) => r.status === 302 });

    let homeRes = http.get(`${BASE_URL}/`);
    check(homeRes, { 'home status 200': (r) => r.status === 200 });

    let categoryRes = http.get(`${BASE_URL}/category?category=2&page=1`);
    check(categoryRes, { 'category page 200': (r) => r.status === 200 });

    let addToCartRes = http.post(`${BASE_URL}/cartAction`, {
        productid: '7',
        addToCart: 'Add to Cart',
    });
    check(addToCartRes, { 'add to cart status 302': (r) => r.status === 302 });

    let cartRes = http.get(`${BASE_URL}/cart`);
    check(cartRes, { 'cart page 200': (r) => r.status === 200 });

    let updateCartRes = http.post(`${BASE_URL}/cartAction`, {
        productid: '7',
        orderitem_7: '2',
        updateCartQuantities: 'Update Cart',
    });
    check(updateCartRes, { 'update cart status 302': (r) => r.status === 302 });

    sleep(1);
}
