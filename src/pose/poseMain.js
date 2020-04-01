'use strict'

import * as posenet from '@tensorflow-models/posenet'
import {drawBoundingBox, drawKeypoints, drawSkeleton,  tryResNetButtonText, updateTryResNetButtonDatGuiCss} from './demo_util'

const videoWidth = 960;
const videoHeight = 540;

class PoseMain {

  constructor(video, canvas, guiState) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.video = video
    this.guiState = guiState

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    this.loadArchitecture(guiState)
  }

  async loadArchitecture(guiState){
    this.net = await posenet.load({
      architecture: guiState.input.architecture,
      outputStride: guiState.input.outputStride,
      inputResolution: guiState.input.inputResolution,
      multiplier: guiState.input.multiplier,
      quantBytes: guiState.input.quantBytes
    })
  }

  changeVideo(){
    this.video = video
  }

  async update(guiState){
    let poses = []
    let minPoseConfidence
    let minPartConfidence

    switch (guiState.algorithm) {

      case 'single-pose':
        const pose = await this.net.estimatePoses(video, {
          flipHorizontal: guiState.flipHorizontal,
          decodingMethod: 'single-person'
        })
        poses = poses.concat(pose)
        minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence
        minPartConfidence = +guiState.singlePoseDetection.minPartConfidence
        break

      case 'multi-pose':
        let all_poses = await this.net.estimatePoses(video, {
          flipHorizontal: guiState.flipHorizontal,
          decodingMethod: 'multi-person',
          maxDetections: guiState.multiPoseDetection.maxPoseDetections,
          scoreThreshold: guiState.multiPoseDetection.minPartConfidence,
          nmsRadius: guiState.multiPoseDetection.nmsRadius
        })

        poses = poses.concat(all_poses)
        minPoseConfidence = +guiState.multiPoseDetection.minPoseConfidence
        minPartConfidence = +guiState.multiPoseDetection.minPartConfidence
        break
    }

    this.ctx.clearRect(0, 0, videoWidth, videoHeight)

    if (guiState.output.showVideo) {
      this.ctx.save()
      this.ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
      this.ctx.restore()
    }

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        if (guiState.output.showPoints) {
          drawKeypoints(keypoints, minPartConfidence, this.ctx)
        }
        if (guiState.output.showSkeleton) {
          drawSkeleton(keypoints, minPartConfidence, this.ctx)
        }
        if (guiState.output.showBoundingBox) {
          drawBoundingBox(keypoints, this.ctx)
        }
      }
    })

    return poses
  }

}

export default PoseMain
