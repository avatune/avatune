import type { BaseAvatarItem, Theme } from '@avatune/types'
import { offsetFrom, percentage } from '@avatune/utils'

const getHeadPosition = (size: number) => ({
  x: size * percentage('32%'),
  y: size * percentage('30%'),
})

const fromHead = offsetFrom(getHeadPosition)

export default {
  style: {
    size: 200,
    backgroundColor: '#a7c957',
    borderRadius: 0,
  },
  body: {
    shirt: {
      position: fromHead(-percentage('0%'), percentage('40.7%')),
      layer: 10,
      color: '#FF7A93',
    },
    sweater: {
      position: fromHead(-percentage('0%'), percentage('40.7%')),
      layer: 10,
      color: '#720026',
    },
    tshort: {
      position: fromHead(percentage('4.7%'), percentage('40.7%')),
      layer: 10,
      color: '#98683D',
    },
    turtleneck: {
      position: fromHead(-percentage('0%'), percentage('40%')),
      layer: 10,
      color: '#F4D150',
    },
  },
  ears: {
    standard: {
      position: fromHead(-percentage('1.8%'), percentage('20%')),
      layer: 100,
      color: '#FFA882',
    },
  },
  eyebrows: {
    angry: {
      position: fromHead(percentage('6%'), percentage('17%')),
      layer: 30,
      color: '#7F3D2B',
    },
    small: {
      position: fromHead(percentage('9%'), percentage('17%')),
      layer: 30,
      color: '#7F3D2B',
    },
    standard: {
      position: fromHead(percentage('7%'), percentage('17%')),
      layer: 30,
      color: '#7F3D2B',
    },
  },
  eyes: {
    boring: {
      position: fromHead(percentage('8.5%'), percentage('21%')),
      layer: 20,
      color: '#FCBE93',
    },
    dots: {
      position: fromHead(percentage('11%'), percentage('21%')),
      layer: 20,
      color: '#000000',
    },
    openCircle: {
      position: fromHead(percentage('8.5%'), percentage('21%')),
      layer: 20,
      color: '#FFFFFF',
    },
    openRounded: {
      position: fromHead(percentage('10%'), percentage('21%')),
      layer: 20,
      color: '#000000',
    },
  },
  hair: {
    bobRounded: {
      position: fromHead(-percentage('0%'), percentage('0%')),
      layer: 5,
      color: '#000000',
    },
    bobStraight: {
      position: fromHead(-percentage('0%'), -percentage('0%')),
      layer: 5,
      color: '#4F8558',
    },
    cupCurly: {
      position: fromHead(-percentage('8.1%'), -percentage('%')),
      layer: 5,
      color: '#302C2C',
    },
    short: {
      position: fromHead(-percentage('1%'), -percentage('1%')),
      layer: 5,
      color: '#7F3D2B',
    },
    long: {
      position: fromHead(-percentage('17%'), -percentage('3%')),
      layer: 5,
      color: '#FFD859',
    },
    medium: {
      position: fromHead(-percentage('0.4%'), -percentage('2%')),
      layer: 5,
      color: '#1F1C41',
    },
  },
  head: {
    oval: {
      position: fromHead(percentage('0%'), percentage('0%')),
      layer: 1,
      color: '#FCBE93',
    },
  },
  mouth: {
    bigSmile: {
      position: fromHead(percentage('10%'), percentage('32%')),
      layer: 25,
      color: '#F06E82',
    },
    flat: {
      position: fromHead(percentage('10%'), percentage('34%')),
      layer: 25,
      color: '#F06E82',
    },
    frown: {
      position: fromHead(percentage('11%'), percentage('33%')),
      layer: 25,
      color: '#F06E82',
    },
    halfOpen: {
      position: fromHead(percentage('9%'), percentage('33%')),
      layer: 25,
      color: '#FFFFFF',
    },
    laugh: {
      position: fromHead(percentage('9.8%'), percentage('33%')),
      layer: 25,
      color: '#000000',
    },
    smile: {
      position: fromHead(percentage('7%'), percentage('30%')),
      layer: 25,
      color: '#000000',
    },
    nervous: {
      position: fromHead(percentage('9.5%'), percentage('32%')),
      layer: 25,
      color: '#000000',
    },
  },
  noses: {
    big: {
      position: fromHead(percentage('15.5%'), percentage('25%')),
      layer: 15,
      color: '#FF9C8D',
    },
    curve: {
      position: fromHead(percentage('16.5%'), percentage('28%')),
      layer: 15,
      color: '#FF9C8D',
    },
    dots: {
      position: fromHead(percentage('16%'), percentage('28%')),
      layer: 15,
      color: '#FF9C8D',
    },
    halfOval: {
      position: fromHead(percentage('16%'), percentage('28%')),
      layer: 15,
      color: '#FF9C8D',
    },
  },
} satisfies Theme<BaseAvatarItem>
