<template>
    <div>
        <carousel
            :centerMode="true"
            :perPage=2
            :autoplay="true"
            :speed="500"
        >
            <slide v-for="(item, index) in companyData">
                <p class="comp-name">{{ item.name }}</p>
                <p class="market-cap">{{ item.markCap }}</p>
                <span :class="'arrow-mark ' + item.rating" />
                <p class="close-price">{{ item.price }}</p>
                <highcharts
                    :options="graphOptions[index]"
                >
                </highcharts>
            </slide>
            <!-- <slide>
                <p class="comp-name">Samsung (AAAA-TSX)</p>
                <p class="market-cap">36,981.77</p>
                <span class="arrow-mark up-arrow" />
                <p class="close-price">337.5</p>
                <highcharts
                    :options="options"
                >
                </highcharts>
            </slide>
            <slide>
                <p class="comp-name">Samsung (AAAA-TSX)</p>
                <p class="market-cap">36,981.77</p>
                <span class="arrow-mark up-arrow" />
                <p class="close-price">337.5</p>
                <highcharts
                    :options="options"
                >
                </highcharts>
            </slide>
            <slide>
                <p class="comp-name">Samsung (AAAA-TSX)</p>
                <p class="market-cap">36,981.77</p>
                <span class="arrow-mark up-arrow" />
                <p class="close-price">337.5</p>
                <highcharts
                    :options="options"
                >
                </highcharts>
            </slide>
            <slide>
                <p class="comp-name">Samsung (AAAA-TSX)</p>
                <p class="market-cap">36,981.77</p>
                <span class="arrow-mark up-arrow" />
                <p class="close-price">337.5</p>
                <highcharts
                    :options="options"
                >
                </highcharts>
            </slide>
            <slide>
                <p class="comp-name">Samsung (AAAA-TSX)</p>
                <p class="market-cap">36,981.77</p>
                <span class="arrow-mark up-arrow" />
                <p class="close-price">337.5</p>
                <highcharts
                    :options="options"
                >
                </highcharts>
            </slide>
            <slide>
                <p class="comp-name">Samsung (AAAA-TSX)</p>
                <p class="market-cap">36,981.77</p>
                <span class="arrow-mark up-arrow" />
                <p class="close-price">337.5</p>
                <highcharts
                    :options="options"
                >
                </highcharts>
            </slide> -->
        </carousel>
    </div>
</template>

<script>
    import { Carousel, Slide } from 'vue-carousel';
    import { Chart } from 'highcharts-vue';
    import axios from 'axios';

    export default {
        name: 'CompanyGraphCarousel',
        components: {
            Carousel,
            Slide,
            highcharts: Chart
        },
        mounted: function() {
            this.fetchData();
        },
        data() {
            return {
                graphOptions: [],
                companyData: [],
                options: {
                    title: {
                        text: 'Company Close Price',
                        x: -20 //center
                    },
                    xAxis: {
                        // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        // 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                        // ],
                    },
                    yAxis: {
                        title: {
                        text: 'Price ($)'
                        },
                        plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: '$'
                    },
                    series: [{
                        data: [66.5, 66, 10,50,44,89,100]
                    }]
                }
            }
        },
        methods: {
            fetchData: function() {
                var state = this;
                axios.get('http://192.168.3.147:8000/api/v1/hackathon/companyGraph/').then(response => {
                    response.data.Data.map(company => {
                        state.companyData.push({
                            name: company.FullCompanyName,
                            markCap: company.MarketCap,
                            rating: company.RatingDesc == 'OP' ? 'up-arrow' : 'down-arrow',
                            price: company.ClosingPrice
                        })
                    })
                    response.data.tableData.map(graph => {
                        var prices = []
                        graph.map(data => {
                            prices.push(data[4])
                        })
                        state.graphOptions.push({
                            title: {
                                text: 'Company Close Price',
                                x: -20 //center
                            },
                            yAxis: {
                                title: {
                                text: 'Price ($)'
                                },
                                plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                                }]
                            },
                            tooltip: {
                                valueSuffix: '$'
                            },
                            series: [{
                                data: prices
                            }]
                        })
                    })
                    console.log(state.graphOptions);
                });
            }
        }
    }
</script>

<style>
    .VueCarousel {
        width: 100%;
        margin-left: 40px;
    }

    .VueCarousel-wrapper .VueCarousel-inner .VueCarousel-slide {
        border-top: 1px solid #e9e9e9;
        border-left: 1px solid #e9e9e9;
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1);
        margin: 0 20px 12px 0;
        padding: 0 15px;
        min-height: 100px;
    }

    .VueCarousel-wrapper .VueCarousel-inner .VueCarousel-slide .comp-name {
        margin: 10px 0 0 0;
        text-align: center;
    }

    .VueCarousel-wrapper .VueCarousel-inner .VueCarousel-slide .market-cap {
        display: inline-block;
        margin: 0;
    }

    .VueCarousel-wrapper .VueCarousel-inner .VueCarousel-slide .arrow-mark {
        float: right;
        margin: 5px 26px 0 0;
    }

    .VueCarousel-wrapper .VueCarousel-inner .VueCarousel-slide .close-price {
        float: right;
        display: inline-block;
        margin: 0;
    }
</style>
