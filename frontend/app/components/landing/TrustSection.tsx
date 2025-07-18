'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'
import { CTAButton } from '../ui/BaseButton'

export default function SafetyStatement() {
  const headingSize = useBreakpointValue({ base: '2xl', md: '4xl' })

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={6}
      bg="background"
      color="textPrimary"
      textAlign="center"
    >
      <VStack gap={6} maxW="3xl" mx="auto">
        <Heading
          as="h2"
          fontSize={headingSize}
          fontWeight="bold"
          lineHeight="1.3"
        >
          Atualmente você compra na internet com o coração na mão e contando com a sorte…
        </Heading>

        <Text as="p" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="semibold" color="textPrimary">
          Com o Investiga+ você tem a certeza de que vai receber o que está comprando
          e que seus dados pessoais estarão protegidos!
        </Text>

        <Text as="p" fontSize="lg" color="textSecondary" fontWeight="medium">
          Agora você só cai em golpe se quiser!
        </Text>

        <CTAButton
          variant="cta"
          withArrow={false}
          href="https://pay.kirvano.com/d58e8cff-c66f-45b4-bdea-02fd1ec174c2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <HStack gap={3}>
            <Text>NÃO QUERO MAIS CAIR EM GOLPES</Text>
            <Icon as={FiSend} />
          </HStack>
        </CTAButton>
      </VStack>
    </Box>
  )
}
