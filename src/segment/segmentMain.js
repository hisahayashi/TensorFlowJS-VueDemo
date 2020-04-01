'use strict'

import * as bodyPix from '@tensorflow-models/body-pix'
import {drawKeypoints, drawSkeleton, toggleLoadingUI, TRY_RESNET_BUTTON_NAME, TRY_RESNET_BUTTON_TEXT, updateTryResNetButtonDatGuiCss} from './demo_util'
import * as partColorScales from './part_color_scales'

class SegmentMain {

  constructor(video, canvas, state, guiState) {
    this.canvas = canvas
    this.video = video
    this.state = state
    this.guiState = guiState

    this.loadArchitecture(guiState)
  }

  async loadArchitecture(guiState){
    this.net = await bodyPix.load({
      architecture: guiState.architecture,
      outputStride: guiState.outputStride,
      multiplier: guiState.multiplier,
      quantBytes: guiState.quantBytes
    })
  }

  changeVideo(){
    this.video = video
  }

  async update(state, guiState){
    // if changing the model or the camera, wait a second for it to complete
    // then try again.
    if (state.changingArchitecture || state.changingMultiplier || state.changingCamera || state.changingStride || state.changingQuantBytes) {
      console.log('load model...')
      this.loadArchitecture()
      state.changingArchitecture = false
      state.changingMultiplier = false
      state.changingStride = false
      state.changingQuantBytes = false
    }

    return this.updateEstimate(state, guiState)
  }

  async updateEstimate(state, guiState){
    switch (guiState.estimate) {

      case 'segmentation':
        return this.updateEstimateSegment(state, guiState)
        break

      case 'partmap':
        return this.updateEstimatePartmap(state, guiState)
        break

      default:
        break
    }
  }

  async updateEstimateSegment(state, guiState){
    let canvas = this.canvas
    const multiPersonSegmentation = await this.estimateSegmentation()

    switch (guiState.segmentation.effect) {

      case 'mask':
        const ctx = canvas.getContext('2d')
        const foregroundColor = {r: 255, g: 255, b: 255, a: 255}
        const backgroundColor = {r: 0, g: 0, b: 0, a: 255}
        const mask = bodyPix.toMask(multiPersonSegmentation, foregroundColor, backgroundColor, true)

        bodyPix.drawMask(canvas, video, mask, guiState.segmentation.opacity, guiState.segmentation.maskBlurAmount, guiState.flipHorizontal)
        //this.drawPoses(multiPersonSegmentation, guiState.flipHorizontal, ctx)
        break

      case 'bokeh':
        bodyPix.drawBokehEffect(canvas, video, multiPersonSegmentation, +guiState.segmentation.backgroundBlurAmount, guiState.segmentation.edgeBlurAmount, guiState.flipHorizontal)
        break
    }

    return multiPersonSegmentation
  }

  async updateEstimatePartmap(state, guiState){
    let canvas = this.canvas
    const ctx = canvas.getContext('2d')
    const multiPersonPartSegmentation = await this.estimatePartSegmentation()
    const coloredPartImageData = bodyPix.toColoredPartMask(multiPersonPartSegmentation, partColorScales[guiState.partMap.colorScale])

    const maskBlurAmount = 0

    switch (guiState.partMap.effect) {

      case 'pixelation':
        const pixelCellWidth = 10.0

        bodyPix.drawPixelatedMask(canvas, video, coloredPartImageData, guiState.partMap.opacity, maskBlurAmount, guiState.flipHorizontal, pixelCellWidth)
        break

      case 'partMap':
        bodyPix.drawMask(canvas, video, coloredPartImageData, guiState.opacity, maskBlurAmount, guiState.flipHorizontal)
        break

      case 'blurBodyPart':
        const blurBodyPartIds = [0, 1]
        bodyPix.blurBodyPart(canvas, video, multiPersonPartSegmentation, blurBodyPartIds, guiState.partMap.blurBodyPartAmount, guiState.partMap.edgeBlurAmount, guiState.flipHorizontal)
    }

    this.drawPoses(multiPersonPartSegmentation, guiState.flipHorizontal, ctx)

    return multiPersonPartSegmentation
  }


  drawPoses(personOrPersonPartSegmentation, flipHorizontal, ctx) {
    if (Array.isArray(personOrPersonPartSegmentation)) {
      personOrPersonPartSegmentation.forEach(personSegmentation => {
        let pose = personSegmentation.pose
        if (flipHorizontal) {
          pose = bodyPix.flipPoseHorizontal(pose, personSegmentation.width)
        }
        drawKeypoints(pose.keypoints, 0.1, ctx)
        drawSkeleton(pose.keypoints, 0.1, ctx)
      })
    } else {
      personOrPersonPartSegmentation.allPoses.forEach(pose => {
        if (flipHorizontal) {
          pose = bodyPix.flipPoseHorizontal(
              pose, personOrPersonPartSegmentation.width)
        }
        drawKeypoints(pose.keypoints, 0.1, ctx)
        drawSkeleton(pose.keypoints, 0.1, ctx)
      })
    }
  }


  async estimateSegmentation() {
    let video = this.video
    let net = this.net
    let state = this.state
    let guiState = this.guiState

    let decoding = guiState.multiPersonDecoding

    let multiPersonSegmentation = null

    switch (guiState.algorithm) {

      case 'multi-person-instance':
        return await net.segmentMultiPerson(video, {
          internalResolution: guiState.input.internalResolution,
          segmentationThreshold: Number(guiState.segmentation.segmentationThreshold),
          maxDetections: decoding.maxDetections,
          scoreThreshold: decoding.scoreThreshold,
          nmsRadius: decoding.nmsRadius,
          numKeypointForMatching: decoding.numKeypointForMatching,
          refineSteps: decoding.refineSteps
        })

      case 'person':
        return await net.segmentPerson(video, {
          internalResolution: guiState.input.internalResolution,
          segmentationThreshold: Number(guiState.segmentation.segmentationThreshold),
          maxDetections: decoding.maxDetections,
          scoreThreshold: decoding.scoreThreshold,
          nmsRadius: decoding.nmsRadius,
        })

      default:
        break
    }
    return multiPersonSegmentation
  }

  async estimatePartSegmentation() {
    let video = this.video
    let net = this.net
    let state = this.state
    let guiState = this.guiState

    let decoding = guiState.multiPersonDecoding

    switch (guiState.algorithm) {

      case 'multi-person-instance':
        return await net.segmentMultiPersonParts(video, {
        internalResolution: guiState.input.internalResolution,
        segmentationThreshold: Number(guiState.segmentation.segmentationThreshold),
        maxDetections: decoding.maxDetections,
        scoreThreshold: decoding.scoreThreshold,
        nmsRadius: decoding.nmsRadius,
        numKeypointForMatching: decoding.numKeypointForMatching,
        refineSteps: decoding.refineSteps
        })

      case 'person':
        return await net.segmentPersonParts(video, {
        internalResolution: guiState.input.internalResolution,
        segmentationThreshold: Number(guiState.segmentation.segmentationThreshold),
        maxDetections: decoding.maxDetections,
        scoreThreshold: decoding.scoreThreshold,
        nmsRadius: decoding.nmsRadius,
        })

      default:
        break
    }

    return multiPersonPartSegmentation
  }

}

export default SegmentMain
