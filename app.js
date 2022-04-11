require('dotenv').config()

const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const path  = require('path')
const port = 6653

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(methodOverride())
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

// Initialize the prismic.io api
const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
		accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

// Link Resolver
const handleLinkResolver = doc => {
	if (doc.type === 'product') {
		return `/detail/${doc.slug}`
	}

	if (doc.type === 'about') {
		return '/about'
	}

	if (doc.type === 'collections') {
		return '/collections'
	}

  // Define the url depending on the document type
  // if (doc.type === 'page') {
  //   return '/page/' + doc.uid;
  // } else if (doc.type === 'blog_post') {
  //   return '/blog/' + doc.uid;
  // }

  // Default to homepage
  return '/'
}

// Middleware to inject prismic context
app.use((req, res, next) => {

	res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
	}

	//res.locals.Link = handleLinkResolver

	res.locals.Numbers = index => {
		return index == 0 ? 'One' : index == 1 ? 'Two' : index == 2 ? 'Three' : index == 3 ? 'Four' : '';
	}

	res.locals.PrismicDOM = PrismicDOM

	next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const handleRequest = async api => {
	const meta = await api.getSingle('metadata')

	return {
		meta
	}
}

app.get('/', (req, res) => {
	//const api = await initApi(req)
	//const defaults = await handleRequest(api)
	//const home = await api.getSingle('home')

  res.render('pages/home', {title: "Home"})
})

app.get('/about', (req, res) => {
	//const api = await initApi(req)
	//const defaults = await handleRequest(api)
	//const home = await api.getSingle('home')

  res.render('pages/about', {title: "About"})
})

app.get('/notes', async (req, res) => {
	const api = await initApi(req)
	//const defaults = await handleRequest(api)
	const note = await api.getSingle('note')

	let notes = [];
	console.log("before push"+notes)
	notes.push(note)
	console.log("after push"+notes)

  res.render('pages/notes', {
		title: "Notes",
		note

	})
})

app.get('/contact', (req, res) => {
	//const api = await initApi(req)
	//const defaults = await handleRequest(api)
	//const home = await api.getSingle('home')

  res.render('pages/contact', {title: "Contact"})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})