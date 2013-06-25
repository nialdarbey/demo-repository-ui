Api.Stateable = Em.Mixin.create({
    status: Milo.property('string', { defaultValue: 'active' }),
    
    isActive: function () {
        return (this.get('status') || '').toLocaleLowerCase() === 'active';
    }.property('status'),

    isApproved: function () {
        return (this.get('status') || '').toLocaleLowerCase() === 'approved';
    }.property('status'),

    isRejected: function () {
        return (this.get('status') || '').toLocaleLowerCase() === 'rejected';
    }.property('status'),

    isRevoked: function () {
        return (this.get('status') || '').toLocaleLowerCase() === 'revoked';
    }.property('status'),

    isPending: function () {
        return (this.get('status') || '').toLocaleLowerCase() === 'pending';
    }.property('status')
});