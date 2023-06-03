import { mount } from '@vue/test-utils'
// @ts-ignore
import App from '../App.vue'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { Store } from '../rating/store'
// @ts-ignore
import CoachComponent from '../coachLocator/Component.vue'
// @ts-ignore
import StoreComponent from '../rating/Component.vue'

describe('Coach locator component', () => {
  it('renders proper amount of child components', async () => {
    createTestingPinia({ createSpy: vi.fn })
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              matches: {
                stores: new Map<string, Store>([
                  ['coach1', new Store('coach1')],
                  ['coach2', new Store('coach2')]
                ])
              }
            },
            createSpy: vi.fn
          })
        ]
      }
    })

    expect(wrapper.findComponent(CoachComponent).exists()).toBeTruthy()
    expect(wrapper.findAllComponents(StoreComponent).length).toBe(2)
  })
})
