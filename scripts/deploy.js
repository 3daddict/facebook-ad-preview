const ghpages = require('gh-pages');

ghpages.publish(
    '__sapper__/export',
    {
        branch: 'master',
        repo: 'https://github.com/3daddict/facebook-ad-preview.git',
        user: {
            name: '3daddict',
            email: 'info@msalvati.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)