import { offsetFrom } from '@avatune/utils'

const getHeadPosition = (size: number) => ({
  x: size * 0.32,
  y: size * 0.3,
})

const fromHead = offsetFrom(getHeadPosition)

export default {
  metadata: {
    size: 200,
    backgroundColor: '#a7c957',
    borderRadius: 0,
  },
  body: {
    sweater: {
      position: fromHead(-0.035, 0.42),
      layer: 10,
      tags: ['warm' as const, 'cozy' as const],
      color: '#720026',
    },
  },
  ears: {
    standard: {
      position: fromHead(-0.018, 0.2),
      layer: 100,
      tags: ['standard' as const, 'classic' as const, 'normal' as const],
      color: '#FFA882',
    },
  },
  eyebrows: {
    standard: {
      position: fromHead(0.07, 0.17),
      layer: 30,
      tags: ['bold' as const, 'strong' as const, 'expressive' as const],
      color: '#7F3D2B',
    },
  },
  eyes: {
    boring: {
      position: fromHead(0.075, 0.21),
      layer: 20,
      tags: ['arrows' as const, 'playful' as const, 'unique' as const],
      color: '#FCBE93',
    },
    dots: {
      position: fromHead(0.11, 0.21),
      layer: 20,
      tags: ['cute' as const, 'friendly' as const, 'soft' as const],
      color: '#000000',
    },
  },
  hair: {
    short: {
      position: fromHead(-0.01, -0.01),
      layer: 5,
      tags: ['boom' as const, 'explosive' as const, 'dynamic' as const],
      color: '#7F3D2B',
    },
    long: {
      position: fromHead(-0.17, -0.03),
      layer: 5,
      tags: ['bundle' as const, 'tied' as const, 'neat' as const],
      color: '#FFD859',
    },
    medium: {
      position: fromHead(-0.004, -0.02),
      layer: 5,
      tags: ['cute' as const, 'adorable' as const, 'sweet' as const],
      color: '#1F1C41',
    },
  },
  head: {
    oval: {
      position: fromHead(0, 0),
      layer: 1,
      tags: ['oval' as const, 'classic' as const, 'balanced' as const],
      color: '#FCBE93',
    },
  },
  mouth: {
    laugh: {
      position: fromHead(0.098, 0.33),
      layer: 25,
      tags: ['lips' as const, 'subtle' as const, 'closed' as const],
      color: '#000000',
    },
    smile: {
      position: fromHead(0.07, 0.3),
      layer: 25,
      tags: ['smile' as const, 'happy' as const, 'cheerful' as const],
      color: '#000000',
    },
    nervous: {
      position: fromHead(0.085, 0.32),
      layer: 25,
      tags: ['smirk' as const, 'playful' as const, 'mischievous' as const],
      color: '#000000',
    },
  },
  noses: {
    curve: {
      position: fromHead(0.15, 0.28),
      layer: 15,
      tags: ['sharp' as const, 'angular' as const, 'defined' as const],
      color: '#FF9C8D',
    },
    dots: {
      position: fromHead(0.15, 0.28),
      layer: 15,
      tags: ['standard' as const, 'classic' as const, 'normal' as const],
      color: '#FF9C8D',
    },
  },
}
