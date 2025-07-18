'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  Icon,
  SimpleGrid,
  useBreakpointValue,
  Stack
} from '@chakra-ui/react'
import { FiShield } from 'react-icons/fi'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { CTAButton } from '../ui/BaseButton'
import Script from 'next/script'

const MotionBox = motion.create(Box)

const stats = [
  {
    value: 792000,
    label: 'Golpes em 2025',
    id: 'stat-fraudes-2025'
  },
  {
    value: 267000,
    label: 'Sites falsos ativos',
    id: 'stat-sites-falsos'
  },
  {
    value: 3500000000,
    label: 'Perdidos em 2024',
    prefix: 'R$',
    formattedMobile: 'R$3.5Bi',
    id: 'stat-dinheiro-perdido'
  }
]

export default function StatsSection() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box as="section" py={{ base: 12, md: 20 }} px={{ base: 4, md: 6 }} bg="white" textAlign="center">
      <Heading
        as="h1"
        fontSize={{ base: '2xl', md: '4xl' }}
        color="blue.900"
        mb={{ base: 4, md: 6 }}
      >
        Sua segurança é importante.
      </Heading>

      <Heading
        as="h2"
        fontSize={{ base: 'lg', md: '3xl' }}
        color="blue.900"
        mb={4}
      >
        Milhares já caíram em golpes. Você não precisa ser o próximo.
      </Heading>

      <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600" maxW="2xl" mx="auto" mb={10}>
        Um clique errado pode custar seu nome, seu cartão e sua paz. Proteja-se com informações confiáveis.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} maxW="5xl" mx="auto" mb={{ base: 10, md: 12 }}>
        {stats.map((stat, i) => (
          <MotionBox
            key={stat.id}
            p={{ base: 4, md: 6 }}
            bg="blue.900"
            color="green.300"
            borderRadius="lg"
            boxShadow="md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
          >
            <VStack gap={2} align="center" textAlign="center">
              <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
                {stat.formattedMobile && isMobile ? (
                  stat.formattedMobile
                ) : stat.prefix ? (
                  <>
                    {stat.prefix}{' '}
                    <CountUp
                      end={stat.value}
                      separator="."
                      duration={2}
                    />
                  </>
                ) : (
                  <CountUp
                    end={stat.value}
                    separator="."
                    duration={2}
                  />
                )}
              </Text>
              <Text fontSize="sm" mt={1} color="green.100">
                {stat.label.toUpperCase()}
              </Text>
            </VStack>
          </MotionBox>
        ))}
      </SimpleGrid>

      <VStack gap={6}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          gap={3}
          align="center"
          justify="center"
          textAlign={{ base: 'center', md: 'start' }}
        >
          <Icon
            as={FiShield}
            color="green.400"
            boxSize={6}
            mb={{ base: 1, md: 0 }}
            aria-hidden
          />
          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" color="gray.700">
            Mais de <b>100.000</b> golpes evitados e dados pessoais protegidos.
          </Text>
        </Stack>

        <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" color="gray.700">
          Não espere mais um golpe para começar a se proteger.
        </Text>

        <CTAButton
          variant="cta"
          size="lg"
          px={6}
          py={4}
          borderRadius="md"
          withArrow
          as="a"
          href="https://pay.kirvano.com/d58e8cff-c66f-45b4-bdea-02fd1ec174c2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Comece Agora
        </CTAButton>
      </VStack>

      <Script id="stats-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "mainEntity": stats.map((stat) => ({
            "@type": "Statistic",
            "name": stat.label,
            "value": stat.value,
            ...(stat.prefix ? { "unitText": stat.prefix } : {})
          }))
        })}
      </Script>
    </Box>
  )
}
