<template>
    <div class="card-listing-container">
        <div class="card" v-for="item in publicationList">
            <div class="title">{{ item._source.title }} ({{ item._source.tags.research_type }})</div>
            <div class="link"><a :href="'/research/' + item._source.product_id" class="card-link">View publication</a></div>
        </div>
    </div>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.css';
    import 'bootstrap-vue/dist/bootstrap-vue.css';
    export default {
        name: 'CardContainer',
        props: {
            publicationList: {
                type: Array,
                default: () => [],
            }
        }
    }
</script>

<style>
    .card-listing-container {
        display: block;
        width: 100%;
    }
    .card-listing-container .card {
        display: block;
        width: 100%;
        height: 60px;
        border: 1px solid #e9e9e9;
    }
    .card-listing-container .card div.title {
        display: inline-block;
        padding: 17px 0 0 20px;
    }
    .card-listing-container .card div.link {
        display: inline-block;
        float: right;
        padding: 17px 20px 0 0;
    }
</style>
