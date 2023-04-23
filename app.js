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
const { internalIP } = require('webpack-dev-server')

// Initialize the prismic.io api
const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

// Link Resolver
function handleLinkResolver(note, noteTopics) {
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
    endpoint: process.env.PRISMIC_ENDPOINT
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

app.get('/', async (req, res) => {
	const api = await initApi(req)
  const defaults = await handleRequest(api)

	//console.log(defaults)

  res.render('pages/home', {
		defaults,
		title: "A foregone conclusion"
	})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})