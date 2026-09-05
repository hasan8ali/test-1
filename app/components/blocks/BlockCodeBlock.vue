<script setup lang="ts">
import { computed } from 'vue'
import type { Block } from '~/types/builder'

const props = defineProps<{ block: Block; editing?: boolean }>()

const lines = computed(() => props.block.props.code.split('\n'))

// Very lightweight syntax highlighting by language
const highlightLine = (line: string) => {
  let out = escapeHtml(line)
  if (props.block.props.language === 'javascript' || props.block.props.language === 'typescript') {
    // Comments
    out = out.replace(/(\/\/.*)/g, '<span class="t-code-comment">$1</span>')
    // Strings
    out = out.replace(/(['"`])((?:\\.|(?!\1).)*)\1/g, '<span class="t-code-string">$1$2$1</span>')
    // Keywords
    out = out.replace(/\b(const|let|var|function|return|if|else|for|while|class|extends|import|export|from|new|await|async|try|catch|throw|typeof|instanceof|in|of|switch|case|break|continue|default)\b/g, '<span class="t-code-keyword">$1</span>')
    // Numbers
    out = out.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="t-code-number">$1</span>')
  } else if (props.block.props.language === 'html' || props.block.props.language === 'vue') {
    out = out.replace(/(&lt;\/?[\w-]+)/g, '<span class="t-code-keyword">$1</span>')
    out = out.replace(/([\w-]+)(=)(&quot;[^&]*&quot;)/g, '<span class="t-code-attr">$1</span>$2<span class="t-code-string">$3</span>')
  } else if (props.block.props.language === 'css') {
    out = out.replace(/([\w-]+)(\s*:)/g, '<span class="t-code-attr">$1</span>$2')
    out = out.replace(/(:\s*)([^;{}\n]+)/g, '$1<span class="t-code-string">$2</span>')
  }
  return out
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
</script>

<template>
  <div dir="ltr" class="bg-[#1e293b] text-[#f1f5f9] rounded-xl overflow-hidden">
    <div class="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-[#334155]">
      <span class="text-xs text-[#94a3b8] font-mono">{{ block.props.language }}</span>
      <UIcon name="i-lucide-code" class="text-[#94a3b8]" />
    </div>
    <div class="overflow-x-auto p-4 text-sm font-mono leading-relaxed">
      <table v-if="block.props.showLineNumbers" class="w-full">
        <tbody>
          <tr v-for="(line, i) in lines" :key="i">
            <td class="text-[#64748b] select-none pr-4 text-right">{{ i + 1 }}</td>
            <td class="whitespace-pre" v-html="highlightLine(line) || '&nbsp;'" />
          </tr>
        </tbody>
      </table>
      <pre v-else class="whitespace-pre"><code v-for="(line, i) in lines" :key="i" v-html="highlightLine(line) + '\n'" /></pre>
    </div>
  </div>
</template>

<style scoped>
:deep(.t-code-comment) { color: #6b7280; font-style: italic; }
:deep(.t-code-string) { color: #fbbf24; }
:deep(.t-code-keyword) { color: #c084fc; font-weight: 600; }
:deep(.t-code-number) { color: #fb7185; }
:deep(.t-code-attr) { color: #60a5fa; }
</style>
