var App = require('app');

App.StarRatingView = App.BaseView.extend({
    templateName: require('templates/common/starRating'),
    classNames: ['rating star-rating'],
    tagName: 'span',
    stars: 0,
    maxStars: 5,

    fullStars: function () {
        var stars = [],
            starCount = Math.floor(parseInt(this.get('stars'), 10));

        for (var i = 1; i <= starCount; i++) {
            stars.push(i);
        }

        return stars;
    }.property('stars'),

    emptyStars: function () {
        var stars = [],
            starCount = Math.floor(parseInt(this.get('stars'), 10)),
            maxStars = this.get('maxStars');

        for (var i = starCount + 1; i <= maxStars; i++) {
            stars.push(i);
        }

        return stars;
    }.property('stars'),

    starClicked: function (event) {
        this.set('stars', parseInt(event.context.toString(), 10));
    }
});
