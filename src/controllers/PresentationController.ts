/* eslint-disable no-unused-vars */
// @ts-nocheck
import puppeteer from 'puppeteer'
import { PresentationData, PresentationsResponse } from '../types'
import { PresentationType } from '../types/presentation'
import { SLIDESHARE_URL } from '../utils/constants'

export async function getAllPresentations (username: string): Promise<PresentationsResponse> {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  let paginationIndex = 1
  let hasContent = true
  const presentationsData: PresentationData[] = []

  while (hasContent) {
    const URL = `${SLIDESHARE_URL}/${username}/presentations/${paginationIndex}`
    await page.goto(URL, {
      waitUntil: 'load',
      timeout: 0
    })

    const presentationsElements = await page.$$('.slideshow-card')
    if (presentationsElements.length > 0) {
      for (const presentationElement of presentationsElements) {
        const title = await (
          await presentationElement.$('h3')
        )?.evaluate((e) => e.textContent) || ''

        const pageUrl = await (
          await (await presentationElement.$('h3'))?.$('a')
        )?.evaluate((e) => e.href) || ''

        const thumbnailUrl = (
          await (
            await presentationElement.$('.thumb')
          )?.evaluate((e) => e.style.backgroundImage)
        ).match(/url\("([^"]+)"\)/)[1]

        const presentation: PresentationData = {
          title,
          pageUrl,
          thumbnailUrl,
          userUrl: `${SLIDESHARE_URL}/${username}`
        }

        presentationsData.push(presentation)
      }
    } else {
      hasContent = false
    }

    paginationIndex++
  }

  browser.close()

  const response: PresentationsResponse = {
    data: presentationsData,
    count: presentationsData.length
  }

  return response
}

export async function getOnePresentation (url: string): Promise<PresentationsResponse> {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'load',
    timeout: 0
  })

  const scriptRaw = await (
    await page.$('#__NEXT_DATA__')
  )?.evaluate((e) => e.textContent) || ''

  browser.close()

  const scriptJson = JSON.parse(scriptRaw) as PresentationType

  const presentationData: PresentationData = {
    pageUrl: scriptJson.props.pageProps.layout.fullPath,
    thumbnailUrl: scriptJson.props.pageProps.slideshow.thumbnail,
    title: scriptJson.props.pageProps.slideshow.title,
    userUrl: `${SLIDESHARE_URL}/${scriptJson.props.pageProps.slideshow.user.login}`,
    categories: scriptJson.props.pageProps.slideshow.categories.map(category => category.name),
    createdAt: scriptJson.props.pageProps.slideshow.createdAt,
    description: scriptJson.props.pageProps.slideshow.description,
    likeCount: scriptJson.props.pageProps.slideshow.likes,
    slides: scriptJson.props.pageProps.slideshow.slideImages.map(slide => slide.baseUrl),
    viewsCount: scriptJson.props.pageProps.slideshow.views
  }

  const response: PresentationsResponse = {
    data: presentationData
  }

  return response
}
