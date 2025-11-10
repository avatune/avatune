import type { BaseAvatarItem, Theme } from '@avatune/types'
import { offsetFrom, percentage } from '@avatune/utils'

const getHeadPosition = (size: number) => ({
  x: size * percentage('27%'),
  y: size * percentage('25%'),
})

const fromHead = offsetFrom(getHeadPosition)

export default {
  style: {
    size: 200,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderRadius: '100%',
  },
  body: {},
  ears: {
    round: {
      position: fromHead(-percentage('3.5%'), percentage('27%')),
      layer: 100,
      color: '#000000',
    },
    standard: {
      position: fromHead(-percentage('2.5%'), percentage('27%')),
      layer: 100,
      color: '#000000',
    },
  },
  eyebrows: {
    bold: {
      position: fromHead(percentage('8.5%'), percentage('20%')),
      layer: 30,
      color: '#000000',
    },
    raised: {
      position: fromHead(percentage('6%'), percentage('20%')),
      layer: 30,
      color: '#000000',
    },
    sharp: {
      position: fromHead(percentage('5%'), percentage('20%')),
      layer: 30,
      color: '#000000',
    },
  },
  eyes: {
    arrows: {
      position: fromHead(percentage('8%'), percentage('28%')),
      layer: 20,
      color: '#000000',
    },
    cute: {
      position: fromHead(percentage('8%'), percentage('28%')),
      layer: 20,
      color: '#000000',
    },
    sharp: {
      position: fromHead(percentage('6%'), percentage('28%')),
      layer: 20,
      color: '#000000',
    },
    standard: {
      position: fromHead(percentage('7%'), percentage('28%')),
      layer: 20,
      color: '#000000',
    },
  },
  hair: {
    boom: {
      position: fromHead(-percentage('17%'), -percentage('16%')),
      layer: 5,
      color: '#000000',
    },
    bundle: {
      position: fromHead(percentage('0%'), -percentage('18%')),
      layer: 5,
      color: '#000000',
    },
    cute: {
      position: fromHead(-percentage('11%'), -percentage('5%')),
      layer: 5,
      color: '#000000',
    },
    rocket: {
      position: fromHead(-percentage('3%'), -percentage('8%')),
      layer: 5,
      color: '#000000',
    },
    star: {
      position: fromHead(-percentage('1.5%'), -percentage('6%')),
      layer: 5,
      color: '#000000',
    },
  },
  head: {
    oval: {
      position: fromHead(percentage('0%'), percentage('0%')),
      layer: 1,
      color: '#000000',
    },
  },
  mouth: {
    lips: {
      position: fromHead(percentage('15%'), percentage('46%')),
      layer: 25,
      color: '#000000',
    },
    smile: {
      position: fromHead(percentage('15%'), percentage('46%')),
      layer: 25,
      color: '#000000',
    },
    smirk: {
      position: fromHead(percentage('15%'), percentage('46%')),
      layer: 25,
      color: '#000000',
    },
  },
  noses: {
    sharp: {
      position: fromHead(percentage('17%'), percentage('37%')),
      layer: 15,
      color: '#000000',
    },
    standard: {
      position: fromHead(percentage('17%'), percentage('37%')),
      layer: 15,
      color: '#000000',
    },
    wide: {
      position: fromHead(percentage('17%'), percentage('39%')),
      layer: 15,
      color: '#000000',
    },
  },
} satisfies Theme<BaseAvatarItem>
