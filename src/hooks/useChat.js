// // src/hooks/useChat.js
// import { useState, useEffect, useCallback, useRef } from 'react'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { toast } from 'react-hot-toast'
// import { apiClient } from '../services/api'
// import { useAuth } from '../context/AuthContext'

// // Hook principal para chat
// export const useChat = (chatType = 'direct', chatId) => {
//   const { user } = useAuth()
//   const queryClient = useQueryClient()
//   const [typingUsers, setTypingUsers] = useState([])
//   const [isTyping, setIsTyping] = useState(false)
//   const typingTimeoutRef = useRef(null)

//   // Buscar conversas
//   const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
//     queryKey: ['conversations', user?.id],
//     queryFn: async () => {
//       if (!user) return []
//       const response = await apiClient.get(`/api/users/${user.id}/conversations`)
//       return response.data
//     },
//     enabled: !!user,
//     refetchInterval: 30000, // Refetch a cada 30 segundos
//     staleTime: 15000
//   })

//   // Buscar mensagens de uma conversa específica
//   const { data: messages = [], isLoading: messagesLoading } = useQuery({
//     queryKey: ['messages', chatId],
//     queryFn: async () => {
//       if (!chatId) return []
//       const response = await apiClient.get(`/api/conversations/${chatId}/messages`)
//       return response.data
//     },
//     enabled: !!chatId,
//     refetchInterval: 5000, // Messages update mais frequentemente
//     staleTime: 2000
//   })

//   // Enviar mensagem
//   const sendMessage = useMutation({
//     mutationFn: async ({ chatId, content, type = 'text', attachments = [] }) => {
//       const response = await apiClient.post(`/api/conversations/${chatId}/messages`, {
//         content,
//         type,
//         attachments,
//         senderId: user.id
//       })
//       return response.data
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['messages', chatId])
//       queryClient.invalidateQueries(['conversations'])
//       setIsTyping(false)
//     },
//     onError: (error) => {
//       toast.error('Erro ao enviar mensagem: ' + error.message)
//     }
//   })

//   // Criar nova conversa
//   const createConversation = useMutation({
//     mutationFn: async ({ participants, type = 'direct', name, description }) => {
//       const response = await apiClient.post('/api/conversations', {
//         participants: [user.id, ...participants],
//         type,
//         name,
//         description,
//         createdBy: user.id
//       })
//       return response.data
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['conversations'])
//       toast.success('Conversa criada com sucesso!')
//     }
//   })

//   // Marcar mensagens como lidas
//   const markAsRead = useMutation({
//     mutationFn: async (chatId) => {
//       await apiClient.patch(`/api/conversations/${chatId}/read`, {
//         userId: user.id
//       })
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['conversations'])
//     }
//   })

//   // Indicador de digitação
//   const handleTyping = useCallback(() => {
//     if (!isTyping) {
//       setIsTyping(true)
//       // Simular envio de status de digitação
//       apiClient.post(`/api/conversations/${chatId}/typing`, {
//         userId: user.id,
//         typing: true
//       }).catch(() => {})
//     }

//     // Reset do timeout
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current)
//     }

//     typingTimeoutRef.current = setTimeout(() => {
//       setIsTyping(false)
//       apiClient.post(`/api/conversations/${chatId}/typing`, {
//         userId: user.id,
//         typing: false
//       }).catch(() => {})
//     }, 3000)
//   }, [chatId, user.id, isTyping])

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current)
//       }
//     }
//   }, [])

//   return {
//     conversations,
//     messages,
//     typingUsers,
//     isLoading: conversationsLoading || messagesLoading,
//     sendMessage: sendMessage.mutate,
//     createConversation: createConversation.mutate,
//     markAsRead: markAsRead.mutate,
//     handleTyping,
//     isSending: sendMessage.isPending,
//     isCreating: createConversation.isPending
//   }
// }

// // Componente principal de chat
// export const ChatInterface = () => {
//   const [selectedChat, setSelectedChat] = useState(null)
//   const [showNewChatModal, setShowNewChatModal] = useState(false)
//   const { 
//     conversations, 
//     messages, 
//     sendMessage, 
//     createConversation,
//     markAsRead,
//     handleTyping,
//     isLoading,
//     isSending 
//   } = useChat()

//   const [newMessage, setNewMessage] = useState('')
//   const messagesEndRef = useRef(null)

//   // Auto-scroll para última mensagem
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   // Marcar como lida ao selecionar conversa
//   useEffect(() => {
//     if (selectedChat) {
//       markAsRead(selectedChat.id)
//     }
//   }, [selectedChat, markAsRead])

//   const handleSendMessage = (e) => {
//     e.preventDefault()
//     if (!newMessage.trim() || !selectedChat) return

//     sendMessage({
//       chatId: selectedChat.id,
//       content: newMessage.trim()
//     })
//     setNewMessage('')
//   }

//   const handleInputChange = (e) => {
//     setNewMessage(e.target.value)
//     if (selectedChat) {
//       handleTyping()
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Carregando conversas...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex h-[600px] border border-gray-200 rounded-lg overflow-hidden">
//       {/* Sidebar - Lista de conversas */}
//       <div className="w-1/3 bg-gray-50 border-r border-gray-200">
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-medium text-gray-900">Mensagens</h3>
//             <button
//               onClick={() => setShowNewChatModal(true)}
//               className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//             >
//               <Plus className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         <div className="overflow-y-auto h-full">
//           {conversations.length > 0 ? (
//             conversations.map((conversation) => (
//               <ConversationItem
//                 key={conversation.id}
//                 conversation={conversation}
//                 isSelected={selectedChat?.id === conversation.id}
//                 onClick={() => setSelectedChat(conversation)}
//               />
//             ))
//           ) : (
//             <div className="p-4 text-center text-gray-500">
//               <MessageCircle className="w-8 h-8 mx-auto mb-2" />
//               <p className="text-sm">Nenhuma conversa ainda</p>
//               <button
//                 onClick={() => setShowNewChatModal(true)}
//                 className="text-blue-600 text-sm hover:underline mt-1"
//               >
//                 Iniciar conversa
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {selectedChat ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-4 bg-white border-b border-gray-200">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                   {selectedChat.type === 'group' ? (
//                     <Users className="w-5 h-5 text-blue-600" />
//                   ) : (
//                     <User className="w-5 h-5 text-blue-600" />
//                   )}
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-900">
//                     {selectedChat.name || selectedChat.participants?.map(p => p.name).join(', ')}
//                   </h4>
//                   <p className="text-sm text-gray-500">
//                     {selectedChat.type === 'group' 
//                       ? `${selectedChat.participants?.length} membros`
//                       : 'Conversa direta'
//                     }
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {messages.map((message) => (
//                 <MessageBubble key={message.id} message={message} />
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Message Input */}
//             <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
//               <div className="flex items-end space-x-3">
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={handleInputChange}
//                     placeholder="Digite sua mensagem..."
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     disabled={isSending}
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={!newMessage.trim() || isSending}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                 >
//                   {isSending ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <Send className="w-4 h-4" />
//                   )}
//                 </button>
//               </div>
//             </form>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500">
//             <div className="text-center">
//               <MessageCircle className="w-12 h-12 mx-auto mb-4" />
//               <p className="text-lg font-medium mb-2">Selecione uma conversa</p>
//               <p className="text-sm">Escolha uma conversa para começar a chatear</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal para nova conversa */}
//       {showNewChatModal && (
//         <NewChatModal
//           isOpen={showNewChatModal}
//           onClose={() => setShowNewChatModal(false)}
//           onCreateConversation={createConversation}
//         />
//       )}
//     </div>
//   )
// }

// // Componente de item de conversa
// const ConversationItem = ({ conversation, isSelected, onClick }) => {
//   const lastMessage = conversation.lastMessage
//   const unreadCount = conversation.unreadCount || 0

//   const formatTime = (date) => {
//     const now = new Date()
//     const messageDate = new Date(date)
//     const diffInHours = (now - messageDate) / (1000 * 60 * 60)
    
//     if (diffInHours < 24) {
//       return messageDate.toLocaleTimeString('pt-BR', { 
//         hour: '2-digit', 
//         minute: '2-digit' 
//       })
//     } else {
//       return messageDate.toLocaleDateString('pt-BR', { 
//         day: '2-digit', 
//         month: '2-digit' 
//       })
//     }
//   }

//   return (
//     <div
//       onClick={onClick}
//       className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
//         isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
//       }`}
//     >
//       <div className="flex items-start space-x-3">
//         <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
//           {conversation.type === 'group' ? (
//             <Users className="w-6 h-6" />
//           ) : (
//             conversation.name?.charAt(0).toUpperCase() || '?'
//           )}
//         </div>
        
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between">
//             <h4 className={`text-sm font-medium truncate ${
//               unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
//             }`}>
//               {conversation.name || conversation.participants?.map(p => p.name).join(', ')}
//             </h4>
//             {lastMessage && (
//               <span className="text-xs text-gray-500 ml-2">
//                 {formatTime(lastMessage.createdAt)}
//               </span>
//             )}
//           </div>
          
//           <div className="flex items-center justify-between mt-1">
//             <p className={`text-sm truncate ${
//               unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
//             }`}>
//               {lastMessage?.content || 'Nova conversa'}
//             </p>
//             {unreadCount > 0 && (
//               <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
//                 {unreadCount > 99 ? '99+' : unreadCount}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Componente de bolha de mensagem
// const MessageBubble = ({ message }) => {
//   const { user } = useAuth()
//   const isOwn = message.senderId === user?.id

//   return (
//     <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
//       <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
//         {!isOwn && (
//           <p className="text-xs text-gray-500 mb-1 px-3">
//             {message.sender?.name}
//           </p>
//         )}
//         <div
//           className={`px-4 py-2 rounded-2xl ${
//             isOwn
//               ? 'bg-blue-600 text-white rounded-br-md'
//               : 'bg-gray-200 text-gray-900 rounded-bl-md'
//           }`}
//         >
//           <p className="text-sm">{message.content}</p>
//           <p className={`text-xs mt-1 ${
//             isOwn ? 'text-blue-100' : 'text-gray-500'
//           }`}>
//             {new Date(message.createdAt).toLocaleTimeString('pt-BR', {
//               hour: '2-digit',
//               minute: '2-digit'
//             })}
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Modal para nova conversa
// const NewChatModal = ({ isOpen, onClose, onCreateConversation }) => {
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedUsers, setSelectedUsers] = useState([])
//   const [chatType, setChatType] = useState('direct')
//   const [groupName, setGroupName] = useState('')

//   // Buscar usuários
//   const { data: users = [] } = useQuery({
//     queryKey: ['users', searchTerm],
//     queryFn: async () => {
//       if (!searchTerm) return []
//       const response = await apiClient.get('/api/users/search', {
//         params: { q: searchTerm }
//       })
//       return response.data
//     },
//     enabled: searchTerm.length > 2
//   })

//   const handleCreateChat = () => {
//     if (selectedUsers.length === 0) return

//     const conversationData = {
//       participants: selectedUsers.map(user => user.id),
//       type: chatType,
//       ...(chatType === 'group' && { name: groupName })
//     }

//     onCreateConversation(conversationData)
//     onClose()
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Nova Conversa
//             </h3>
//             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-4">
//           {/* Tipo de chat */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Tipo de Conversa
//             </label>
//             <div className="flex space-x-4">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="chatType"
//                   value="direct"
//                   checked={chatType === 'direct'}
//                   onChange={(e) => setChatType(e.target.value)}
//                   className="mr-2"
//                 />
//                 <span className="text-sm">Direta</span>
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="chatType"
//                   value="group"
//                   checked={chatType === 'group'}
//                   onChange={(e) => setChatType(e.target.value)}
//                   className="mr-2"
//                 />
//                 <span className="text-sm">Grupo</span>
//               </label>
//             </div>
//           </div>

//           {/* Nome do grupo */}
//           {chatType === 'group' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Nome do Grupo
//               </label>
//               <input
//                 type="text"
//                 value={groupName}
//                 onChange={(e) => setGroupName(e.target.value)}
//                 placeholder="Digite o nome do grupo"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           )}

//           {/* Buscar usuários */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Buscar Usuários
//             </label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Digite para buscar..."
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Lista de usuários */}
//           <div className="max-h-48 overflow-y-auto space-y-2">
//             {users.map((user) => (
//               <label key={user.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
//                 <input
//                   type="checkbox"
//                   checked={selectedUsers.some(selected => selected.id === user.id)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       if (chatType === 'direct' && selectedUsers.length > 0) {
//                         setSelectedUsers([user])
//                       } else {
//                         setSelectedUsers([...selectedUsers, user])
//                       }
//                     } else {
//                       setSelectedUsers(selectedUsers.filter(selected => selected.id !== user.id))
//                     }
//                   }}
//                   className="mr-3"
//                 />
//                 <div className="flex items-center space-x-3">
//                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                     <User className="w-4 h-4 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">{user.name}</p>
//                     <p className="text-xs text-gray-500">{user.type}</p>
//                   </div>
//                 </div>
//               </label>
//             ))}
//           </div>
//         </div>

//         <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             Cancelar
//           </button>
//           <button
//             onClick={handleCreateChat}
//             disabled={selectedUsers.length === 0 || (chatType === 'group' && !groupName)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//           >
//             Criar Conversa
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Imports necessários no topo do arquivo
// import React, { useState, useEffect, useRef } from 'react'
// import { 
//   MessageCircle, 
//   Plus, 
//   Users, 
//   User, 
//   Send, 
//   Loader2, 
//   X, 
//   Search 
// } from 'lucide-react'