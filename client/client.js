let APP_API = [
    'http://localhost:5000/search/cl/',
    'http://localhost:5000/search/overflow/'
];

let CITY_API = 'http://localhost:5000/search/citydata/';

const app = new Vue({
    el: '#app',
    data: {
        city: '',
        term: '',
        jobs: [],
        cityData: [],
        selectedJobs: []
    },

    methods: {
        handleSubmit() {
            const city = this.city 
            const input = this.term + '/' + this.city;
            const jobUrl = APP_API.map(u => u + input);
            const cityUrl = CITY_API + this.city;
            console.log(cityUrl);
            console.log(jobUrl);
            
            Promise.all([
                fetch(jobUrl[0])
                    .then(response => response.json()),
                fetch(jobUrl[1])
                    .then(res1 => res1.json()),
                fetch(cityUrl)
                    .then(res2 => res2.json())
            ]).then(results => {
                const datar1 = results[0];
                const datar2 = results[1];
                this.cityData = results[2].numbeoJson[0];
                this.jobs = Object.assign(datar1,datar2);
                console.log(this.jobs.clJson[1].title)
            });
            
        },

        addJobs(job) {
            this.selectedJobs.push(job);
        }
        
    }
});