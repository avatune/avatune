const getHeadPosition = (width: number, height: number) => ({
  x: width * 0.27,
  y: height * 0.25,
})

export default {
  metadata: {
    size: 200,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderRadius: '100%',
  },
  body: {},
  ears: {
    round: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x - width * 0.035,
          y: headPosition.y + height * 0.27,
        }
      },
      layer: 100,
      tags: ['round' as const, 'soft' as const, 'friendly' as const],
      color: '#000000',
    },
    standard: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x - width * 0.025,
          y: headPosition.y + height * 0.27,
        }
      },
      layer: 100,
      tags: ['standard' as const, 'classic' as const, 'normal' as const],
      color: '#000000',
    },
  },
  eyebrows: {
    bold: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.085,
          y: headPosition.y + height * 0.2,
        }
      },
      layer: 30,
      tags: ['bold' as const, 'strong' as const, 'expressive' as const],
      color: '#000000',
    },
    raised: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.06,
          y: headPosition.y + height * 0.2,
        }
      },
      layer: 30,
      tags: ['raised' as const, 'surprised' as const, 'questioning' as const],
      color: '#000000',
    },
    sharp: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.05,
          y: headPosition.y + height * 0.2,
        }
      },
      layer: 30,
      tags: ['sharp' as const, 'angular' as const, 'intense' as const],
      color: '#000000',
    },
  },
  eyes: {
    arrows: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.08,
          y: headPosition.y + height * 0.28,
        }
      },
      layer: 20,
      tags: ['arrows' as const, 'playful' as const, 'unique' as const],
      color: '#000000',
    },
    cute: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.08,
          y: headPosition.y + height * 0.28,
        }
      },
      layer: 20,
      tags: ['cute' as const, 'friendly' as const, 'soft' as const],
      color: '#000000',
    },
    sharp: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.06,
          y: headPosition.y + height * 0.28,
        }
      },
      layer: 20,
      tags: ['sharp' as const, 'focused' as const, 'intense' as const],
      color: '#000000',
    },
    standard: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.07,
          y: headPosition.y + height * 0.28,
        }
      },
      layer: 20,
      tags: ['standard' as const, 'classic' as const, 'normal' as const],
      color: '#000000',
    },
  },
  hair: {
    boom: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x - width * 0.17,
          y: headPosition.y - height * 0.16,
        }
      },
      layer: 5,
      tags: ['boom' as const, 'explosive' as const, 'dynamic' as const],
      color: '#000000',
    },
    bundle: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x,
          y: headPosition.y - height * 0.18,
        }
      },
      layer: 5,
      tags: ['bundle' as const, 'tied' as const, 'neat' as const],
      color: '#000000',
    },
    cute: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x - width * 0.11,
          y: headPosition.y - height * 0.05,
        }
      },
      layer: 5,
      tags: ['cute' as const, 'adorable' as const, 'sweet' as const],
      color: '#000000',
    },
    rocket: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x - width * 0.03,
          y: headPosition.y - height * 0.08,
        }
      },
      layer: 5,
      tags: ['rocket' as const, 'spiky' as const, 'energetic' as const],
      color: '#000000',
    },
    star: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x - width * 0.015,
          y: headPosition.y - height * 0.06,
        }
      },
      layer: 5,
      tags: ['star' as const, 'magical' as const, 'whimsical' as const],
      color: '#000000',
    },
  },
  head: {
    oval: {
      position: getHeadPosition,
      layer: 1,
      tags: ['oval' as const, 'classic' as const, 'balanced' as const],
      color: '#000000',
    },
  },
  mouth: {
    lips: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.15,
          y: headPosition.y + height * 0.46,
        }
      },
      layer: 25,
      tags: ['lips' as const, 'subtle' as const, 'closed' as const],
      color: '#000000',
    },
    smile: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.15,
          y: headPosition.y + height * 0.46,
        }
      },
      layer: 25,
      tags: ['smile' as const, 'happy' as const, 'cheerful' as const],
      color: '#000000',
    },
    smirk: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.15,
          y: headPosition.y + height * 0.46,
        }
      },
      layer: 25,
      tags: ['smirk' as const, 'playful' as const, 'mischievous' as const],
      color: '#000000',
    },
  },
  noses: {
    sharp: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.17,
          y: headPosition.y + height * 0.37,
        }
      },
      layer: 15,
      tags: ['sharp' as const, 'angular' as const, 'defined' as const],
      color: '#000000',
    },
    standard: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.17,
          y: headPosition.y + height * 0.37,
        }
      },
      layer: 15,
      tags: ['standard' as const, 'classic' as const, 'normal' as const],
      color: '#000000',
    },
    wide: {
      position: (width: number, height: number) => {
        const headPosition = getHeadPosition(width, height)
        return {
          x: headPosition.x + width * 0.17,
          y: headPosition.y + height * 0.39,
        }
      },
      layer: 15,
      tags: ['wide' as const, 'broad' as const, 'prominent' as const],
      color: '#000000',
    },
  },
}
