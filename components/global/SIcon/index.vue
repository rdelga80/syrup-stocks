<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, h } from '@nuxtjs/composition-api'

const iconComponent = (iconName: string) =>
  defineAsyncComponent(() => import(`./icons/${iconName}.vue`))

export default defineComponent({
  name: 'SIcon',
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return () => h(iconComponent(props.icon))
  },
})
</script>
