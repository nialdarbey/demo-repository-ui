var App = require('app');

App.StarsView = App.BaseView.extend({
    templateName: require('templates/common/stars'),
    tagName: 'span',
    stars: 0,
    maxStars: 5,

    fullStars: function () {
        var stars = [],
            starCount = Math.floor(this.get('stars'));

        for (var i = 1; i <= starCount; i++) {
            stars.push(i);
        }

        return stars;
    }.property('stars'),

    emptyStars: function () {
        var stars = [],
            starCount = Math.floor(this.get('stars')),
            maxStars = this.get('maxStars');

        for (var i = starCount + 1; i <= maxStars; i++) {
            stars.push(i);
        }

        return stars;
    }.property('stars')
});
