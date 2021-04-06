const express = require('express')
const app = express()
const fs = require('fs')

let postsDb = []

fs.readFile('./data/posts.json', (err, data) => {
	if (!err) {
		postsDb = JSON.parse(data)
	}
})

const parser = require('body-parser')


app.use('/static', express.static('./public'))
app.use(express.urlencoded({ extended: false}))
app.set('view engine', 'pug')



app.get('/', (req, res) => {
    res.render('index')
})

app.get('/create', (req, res) => {
	res.render('create')
})

app.post('/create', (req,res) => {
    const title = req.body.title
    const description = req.body.description

    if (title.trim() === '' && description.trim() === ''){

    res.render('create', { error: true})}
    else {
        fs.readFile('./data/posts.json', (err, data) => {
            if (err) throw err

            const posts = JSON.parse(data)

            posts.push({
                id: id (),
                title: title,
                description: description,

            })

            fs.writeFile('./data/posts.json', JSON.stringify(posts), err => {
                if (err) throw err

                res.render('create', { success:true})
            })

        })
    }
})



app.get('/posts', (req, res) =>{

    fs.readFile('./data/posts.json', (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)
    
    res.render('posts', { posts: posts})
    })
})


app.get('/posts/:id', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/posts.json', (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)

        const post = posts.filter(post => post.id == id)[0]
    
    res.render('detail', { posts: post})
    })

})



app.post('/create', (req, res) => {

	const post = {
		id: generateRandomId(),
		title: req.body.title,
		body: req.body.details
    }

    postsDb.push(post)
	fs.writeFile('./data/posts.json', JSON.stringify(postsDb), (err) => {
		if (err) {
			res.redirect('/create?success=0')
		} else {
			res.redirect('/create?success=1')
		}
	})
})
    

app.listen(8000, err=> {
    if(err) console.log(err)
    console.log('Server is running on port 8000...')
})

function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };