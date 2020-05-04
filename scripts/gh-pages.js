var ghpages = require('gh-pages');

ghpages.publish(
    'public',
    {
        branch: 'gh-pages',
        repo: 'https://github.com/3daddict/facebook-ad-preview.git',
        user: {
            name: 'Mike',
            email: 'info@msalvati.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)