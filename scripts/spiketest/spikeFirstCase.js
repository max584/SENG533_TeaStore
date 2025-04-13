import { group, sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:8080/tools.descartes.teastore.webui';

export const options = {
    stages: [
        { duration: '30s', target: 0 },    // stay at 0 users for 30 seconds (baseline)
        { duration: '10s', target: 100 },  // spike to 100 users over 10 seconds
        { duration: '30s', target: 100 },  // stay at 100 users for 30 seconds (spike)
        { duration: '10s', target: 0 },    // drop back to 0 users over 10 seconds
    ],
};

export default function () {
    group('TeaStore Login Action', () => {
        const loginActionPayload = {
            "referer": `${BASE_URL}/login`,
            "username": "user2",
            "password": "password",
            "signin": "Sign in",
        };
        postLoginAction(loginActionPayload);
    });

    group('TeaStore Homepage', () => {
        getTeaStoreHomepage();
    });

    group('TeaStore Category Browse', () => {
        getTeaStoreProductBrowse("2");
    });

    group('TeaStore Add to Cart', () => {
        const cartActionPayload = {
            "productid": "7",
            "addToCart": "Add to Cart",
        };
        postCartAction(cartActionPayload);
    });

    group('TeaStore View Cart', () => {
        getTeaStoreViewCart();
    });

    group('TeaStore Update Cart', () => {
        const updateCartPayload = {
            "productid": "7",
            "orderitem_7": "2",
            "updateCartQuantities": "Update Cart"
        };
        postUpdateCartAction(updateCartPayload);
    });

    // Think time simulates user reading time etc.
    sleep(1);
}

// Helper functions to encapsulate request logic
function postLoginAction(payload) {
    http.post(`${BASE_URL}/loginAction`, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
}

function getTeaStoreHomepage() {
    http.get(`${BASE_URL}/`);
}

function getTeaStoreProductBrowse(categoryNumber) {
    http.get(`${BASE_URL}/category?category=${categoryNumber}&page=1`);
}

function postCartAction(payload) {
    http.post(`${BASE_URL}/cartAction`, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
}

function getTeaStoreViewCart() {
    http.get(`${BASE_URL}/cart`);
}

function postUpdateCartAction(payload) {
    http.post(`${BASE_URL}/cartAction`, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
}
