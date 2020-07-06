<template>
    <div>
        <nav class="navbar navbar-light bg-light sticky-top">
            <div class="container">
                <div class="w-100 flex justify-content-center pb-3 pt-3">
                    <button v-if="!sortAlphabetically" @click="getImages" class="btn btn-dark">Fetch Images</button>
                    <button v-if="sortAlphabetically" @click="sort" class="btn btn-dark">Sort Alphabetically</button>
                </div>
            </div>
        </nav>
        <div v-if="isLoading" class="w-100 flex justify-content-center pt-3">
            <span>Loading...</span>
        </div>
        <div v-if="isImages" class="container test">
            <div  v-for="(image, index) in images" :key="index">
                <div class="row border mt-3 mb-3 p-5 shadow">
                    <div class="col-xl-6">
                        <div class="border flex h-100 justify-content-center align-items-center pr-5 pl-5 text-center">
                            <span class="text-uppercase bold">{{image.title}}</span>
                            <span class="text-uppercase bold" v-if="!image.title">This image has no title.</span>
                        </div>
                    </div>
                    <div class="col-xl-6 overflow-hidden">
                        <img :src="`https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_z.jpg`">
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isSorted" class="container">
            <div  v-for="(image, index) in sortedImages" :key="index">
                <div class="row border mt-3 mb-3 p-5 shadow">
                    <div class="col-xl-6">
                        <div class="border flex h-100 justify-content-center align-items-center pr-5 pl-5 text-center">
                            <span class="text-uppercase bold">{{image.title}}</span>
                            <span class="text-uppercase bold" v-if="!image.title">This image has no title.</span>
                        </div>
                    </div>
                    <div class="col-xl-6 overflow-hidden">
                            <img :src="`https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_z.jpg`">
                    </div>
                </div>
            </div>
        </div>
        <div v-if="infiniteScroll" class="loading" :class="{show: infiniteScroll}">
            <div class="ball"></div>
            <div class="ball"></div>
            <div class="ball"></div>
        </div>
    </div>
</template>
<script>
import axios from "axios";

var n = 0;
var i = 5;

export default {
    name: "Zenitech",
    data() {
        return {
            isError: false,
            isLoading: false,
            isImages: false,
            sortAlphabetically: false,
            images: [],
            sortedImages: [],
            combinedArray: [],
            isSorted: false,
            infiniteScroll: false,
        }
    },
    created: function(){
        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight }
            = document.documentElement;

            if(clientHeight + scrollTop >= scrollHeight - 5) {
                this.infiniteScroll = true;
                setTimeout(this.loadImages(), 2000);
            }
        })
    },
    methods: {
        sort() {
            
                this.isLoading = true;
                axios.get('http://localhost:5000/fetch')
                    .then(resp => {
                        this.isLoading = false;
                        this.isImages = false;
                        this.isSorted = true;
                        scroll(0,0);
                        this.sortedImages = resp.data;
                        this.sortedImages.sort(this.dynamicSort("title"));
                        this.getFiveSortedImages(this.sortedImages);
                    })
                    .catch(error => {
                        console.log("Error: ", error)
                    })
            
        },
        loadImages() {
            axios.get('http://localhost:5000/fetch')
                .then(resp => {
                    this.infiniteScroll = false;
                    this.updateImages(resp.data);
                    this.updateSortedImages(resp.data);
                })
        },
        updateSortedImages(value) {
            value.sort(this.dynamicSort("title"));
            const sliced = value.slice(n=n+5, i=i+5)
            sliced.forEach(el => {
                this.sortedImages.push(el)
            })
        },
        updateImages(value) {
            let selected = value.slice(n=n+5, i=i+5);
            if (selected) {
                selected.forEach(el => {
                    this.images.push(el)
                })
            }
        },
        
        getFiveImages(value) {
            let n = 5;
            const shuffled = value.sort(() => 0.5 - Math.random());
            let selected = shuffled.slice(0, n);
            this.images = selected;
        },
        getFiveSortedImages(value) {
            let n = 5;
            const shuffled = value.sort(() => 0.5);
            let selected = shuffled.slice(0, n);
            this.sortedImages = selected;
            return this.sortedImages;
        },
        getImages() {
            this.isLoading = true;
            axios.get('http://localhost:5000/fetch')
                .then(response => {
                    this.isLoading = false;
                    this.sortAlphabetically = true;
                    this.images = response.data;
                    this.isImages = true;
                    this.getFiveImages(this.images);
                    this.infiniteScroll = false;
                })
                .catch(error => {
                    console.log("Error: ", error)
                })
        },
        dynamicSort(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                if(sortOrder == -1){
                    return b[property].localeCompare(a[property]);
                }else{
                    return a[property].localeCompare(b[property]);
                }        
            }
        }
    }
}
       
 
</script>

<style lang="scss">

</style>
