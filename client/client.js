const app = new Vue({
    el: '#app',
    data: {
        term: '',
        terms: []
    },

    methods: {
        addTerm() {
            this.terms.push(this.term)
            console.log(this.terms);
        }
    }
    
});