'use client';

import { Box } from '@chakra-ui/react/box';
import { Portal } from '@chakra-ui/react/portal';
import { Spinner } from '@chakra-ui/react/spinner';
import { Text } from '@chakra-ui/react/text';
import { createToaster, Toast, Toaster as ChakraToaster } from '@chakra-ui/react/toast';

import { Colors } from '@/constants/vars';

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '1.2rem' }}>
        {(toast) => (
          <Toast.Root width="max-content" maxW={{ base: '100%', sm: '57.6rem' }}>
            <Box>
              <Box display="flex" alignItems="center" gap=".4rem" w="100%" mb=".4rem">
                {toast.type === 'loading' ? (
                  <Spinner size="sm" color={Colors.WHITE} />
                ) : (
                  <Toast.Indicator maxW="2.4rem" />
                )}

                <Text fontSize="1.4rem" fontWeight="500">
                  {toast.title}
                </Text>
              </Box>

              <Text fontSize="1.4rem" fontWeight="500">
                {toast.description}
              </Text>
            </Box>

            {/* {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
            {toast.closable && <Toast.CloseTrigger />} */}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
