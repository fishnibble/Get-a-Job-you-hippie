let APP_API = [
    'http://localhost:5000/search/cl/',
    'http://localhost:5000/search/overflow/'
];

const app = new Vue({
    el: '#app',
    data: {
        city: '',
        term: '',
    },

    methods: {
        handleSubmit() {

            const input = this.term + '/' + this.city;
            const url = APP_API.map(u => u + input);

            grabContent = url => fetch(url)
                .then(res => res.json())
                .then(results => {
                    console.log(results);
                });

            Promise
                .all(url.map(grabContent));
        }
    }
});