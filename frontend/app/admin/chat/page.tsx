'use client'

import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  useBreakpointValue
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { ChatMessage } from '@/components/admin/chat/ChatMessage'
import { ChatInput } from '@/components/admin/chat/ChatInput'
import { AnimatePresence, motion } from 'framer-motion'
import { retryEnvioMensagem } from '@/utils/retryEnvioMensagem'
import { agruparPorData } from '@/utils/agruparPorData'
import { useChatActions } from '@/hooks/useChatActions'
import { useMensagensConversa } from '@/hooks/useMensagensConversa'
import type { ConversaComExtras } from '@types'
import { formatarDataBrasil } from '@/utils/formatarDataBrasil'
import { BotaoAssumirProxima } from '@/components/admin/chat/BotaoAssumirProxima'
import { BotaoNovaConversa } from '@/components/admin/chat/BotaoNovaConversa'

const MotionBox = motion.create(Box)

export default function ChatAdminPage() {
  const mensagensRef = useRef<HTMLDivElement>(null)
  const ultimoElementoRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const topoRef = useRef<HTMLDivElement>(null)

  const isMobile = useBreakpointValue({ base: true, md: false })

  const [conversas, setConversas] = useState<ConversaComExtras[]>([])
  const [conversaSelecionada, setConversaSelecionada] = useState<ConversaComExtras | null>(null)

  const {
    mensagens,
    setMensagens,
    carregarMais,
    hasMore,
    loading
  } = useMensagensConversa({
    conversaId: conversaSelecionada?.id ?? -1
  })

  const [mensagem, setMensagem] = useState('')

  const {
    enviando,
    enviar,
    setEnviando
  } = useChatActions(
    conversaSelecionada,
    mensagens,
    setMensagens,
    mensagem,
    setMensagem
  )

  useEffect(() => {
    const carregarConversas = async () => {
      try {
        const res = await fetch('/api/admin/conversas', { credentials: 'include' })
        const json = await res.json()
        if (json.success) setConversas(json.data.conversas)
      } catch {
        setConversas([])
      }
    }
    carregarConversas()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        carregarMais()
      }
    })

    const target = topoRef.current 

    if (target) observer.observe(target)

    return () => {
      if (target) observer.unobserve(target)
    }
  }, [hasMore, loading, carregarMais]) 


  useEffect(() => {
    const timeout = setTimeout(() => {
      ultimoElementoRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
    return () => clearTimeout(timeout)
  }, [mensagens])

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [conversaSelecionada, mensagens.length])

  return (
    <Flex direction={isMobile ? 'column' : 'row'} h="calc(100vh - 80px)" overflow="hidden" position="relative">
      <AnimatePresence>
        {(!isMobile || !conversaSelecionada) && (
          <MotionBox
            key="lista"
            w={isMobile ? '100%' : '30%'}
            borderRight={isMobile ? undefined : '1px solid #E2E8F0'}
            overflowY="auto"
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            position={isMobile ? 'absolute' : 'relative'}
            h="full"
            zIndex={2}
            bg="white"
          >
            <Flex justify="space-between" align="center" px={4} pt={4} pb={2}>
              <Heading size="md">Conversas</Heading>
              <HStack gap={2}>
                <BotaoNovaConversa
                  onConversaCriada={(nova) => {
                    setConversas((prev) => [nova, ...prev])
                    setConversaSelecionada(nova)
                  }}
                />
                <BotaoAssumirProxima
                  onConversaAssumida={(conversa) => {
                    setConversas((prev) => [...prev.filter((c) => c.id !== conversa.id), conversa])
                    setConversaSelecionada(conversa)
                  }}
                />
              </HStack>
            </Flex>

            <VStack align="stretch" gap={1} h="full" minH={0}>
              {conversas.map((c) => (
                <Box
                  key={c.id}
                  p={3}
                  bg={conversaSelecionada?.id === c.id ? 'blue.50' : 'white'}
                  borderBottom="1px solid #E2E8F0"
                  cursor="pointer"
                  onClick={() => setConversaSelecionada(c)}
                >
                  <Flex justify="space-between">
                    <Text fontWeight="bold">{c.nome || c.numero}</Text>
                    <Text fontSize="xs" color="gray.500">{format(new Date(c.ultimaMensagemEm), 'HH:mm')}</Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.600" lineClamp={1}>{c.ultimaMensagem}</Text>
                </Box>
              ))}
            </VStack>
          </MotionBox>
        )}

        {(isMobile && conversaSelecionada) || !isMobile ? (
          <MotionBox
            key="mensagens"
            as={Flex}
            direction="column"
            flex="1"
            p={4}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            position={isMobile ? 'absolute' : 'relative'}
            h="full"
            w="100%"
            bg="gray.50"
            zIndex={1}
          >
            {isMobile && (
              <Button size="sm" onClick={() => setConversaSelecionada(null)} mb={2} alignSelf="flex-start">
                ← Voltar
              </Button>
            )}

            {conversaSelecionada && (
              <Flex direction="column" h="full" gap={2} w="full" minH="0">
                <Heading size="sm" mb={1}>
                  Conversando com: {conversaSelecionada.nome || conversaSelecionada.numero}
                </Heading>

                {conversaSelecionada.atendente?.nome && (
                  <Text fontSize="sm" color="gray.600">
                    Sendo atendido por: <strong>{conversaSelecionada.atendente.nome}</strong>
                  </Text>
                )}

                {conversaSelecionada.atendidaPorAutomacao && (
                  <Text fontSize="xs" color="purple.500" fontWeight="bold">
                    Atendimento por Automação
                  </Text>
                )}

                {!conversaSelecionada?.atendenteId && (
                  <Button
                    size="xs"
                    colorScheme="green"
                    alignSelf="flex-start"
                    onClick={async () => {
                      const res = await fetch(`/api/admin/conversas/${conversaSelecionada.id}/atribuir`, {
                        method: 'POST',
                        credentials: 'include',
                      })
                      const json = await res.json()
                      if (json.success) {
                        setConversas((prev) =>
                          prev.map((c) =>
                            c.id === conversaSelecionada.id ? { ...c, atendenteId: 'eu' } : c
                          )
                        )
                        setConversaSelecionada((prev) =>
                          prev ? { ...prev, atendenteId: 'eu' } : prev
                        )
                      }
                    }}
                  >
                    Assumir Conversa
                  </Button>
                )}

                <Box
                  ref={mensagensRef}
                  flex="1"
                  overflowY="auto"
                  p={4}
                  bg="white"
                  w="100%"
                  maxW="100%"
                  minH="0"
                >
                  <VStack gap={4} align="stretch" w="full">
                    <Box ref={topoRef} h="1px" />
                    {agruparPorData(mensagens).map((grupo, idx) => (
                      <Box key={idx}>
                        <Text fontSize="xs" color="gray.500" textAlign="center" my={2}>
                          {formatarDataBrasil(grupo.data)}
                        </Text>
                        {grupo.mensagens.map((m, i) => (
                          <ChatMessage
                            key={`msg-${idx}-${i}`}
                            conteudo={m.conteudo}
                            direcao={m.direcao}
                            status={m.status}
                            timestamp={m.timestamp}
                            atendente={m.atendente ? { nome: m.atendente.nome } : undefined}
                            onRetry={
                              m.status === 'falhou'
                                ? () => retryEnvioMensagem(m, conversaSelecionada, setMensagens, setEnviando)
                                : undefined
                            }
                          />
                        ))}
                      </Box>
                    ))}
                    <Box ref={ultimoElementoRef} />
                  </VStack>
                </Box>

                <Box mt={2} pt={2} borderTop="1px solid #E2E8F0" bg="white" px={4}>
                  <ChatInput
                    mensagem={mensagem}
                    setMensagem={setMensagem}
                    onEnviar={enviar}
                    carregando={enviando}
                    inputRef={inputRef}
                  />
                </Box>
              </Flex>
            )}
          </MotionBox>
        ) : null}
      </AnimatePresence>
    </Flex>
  )
}
