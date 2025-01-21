<template>
  <n-modal-provider>
    <n-config-provider>
      <n-dialog-provider>
        <n-message-provider>
          <div class="h-min-[100vh]">
            <RouterView></RouterView>

          </div>

        </n-message-provider>
      </n-dialog-provider>
    </n-config-provider>
  </n-modal-provider>
</template>

<script setup>

</script>
