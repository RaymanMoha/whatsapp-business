import test from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { prepareWhatsAppImage } from './image-media.js'

test('normalizes WebP catalog photos into decodable JPEG image messages', async () => {
  const webp=await sharp({create:{width:8,height:8,channels:4,background:{r:120,g:50,b:80,alpha:0.5}}}).webp().toBuffer()
  const file=await prepareWhatsAppImage({data:webp.toString('base64'),mimetype:'image/webp'},'sample')
  assert.equal(file.mimetype,'image/jpeg')
  assert.equal(file.filename,'sample.jpg')
  const bytes=Buffer.from(file.data,'base64')
  assert.equal(bytes.subarray(0,2).toString('hex'),'ffd8')
  assert.equal((await sharp(bytes).metadata()).format,'jpeg')
})
