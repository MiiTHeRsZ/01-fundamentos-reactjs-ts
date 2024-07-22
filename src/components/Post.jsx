import { format, formatDistanceToNow } from 'date-fns';
import { Avatar } from './Avatar';
import { Comment } from './Comment';
import styles from './Post.module.css'
import { ptBR } from 'date-fns/locale/pt-BR';
import { useState } from 'react';

export function Post({ author, content, publishedAt }) {
    const publishedDateFormated = format(publishedAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'", { locale: ptBR })
    const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
        locale: ptBR,
        addSuffix: true
    })

    const [comments, setComments] = useState([]);

    const [newCommentText, setNewCommentText] = useState('');

    function handleCreateNewComment() {
        event.preventDefault()

        const newCommentText = event.target.comment.value

        setComments([...comments, newCommentText])
        setNewCommentText('')
    }

    function handleNewCommentChange() {
        event.target.setCustomValidity("")
        setNewCommentText(event.target.value)
    }

    function deleteComment(commentToDelete) {
        const commentWithoutDeleteOne = comments.filter(comment => {
            return comment !== commentToDelete
        })

        setComments(commentWithoutDeleteOne)
    }

    function handleNewCommentInvalid() {
        event.target.setCustomValidity("Esse campo é obrigatório!")
    }

    const isNewCommentEmpty = newCommentText.length === 0

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={author.avatarUrl} />
                    <div className={styles.authorInfo}>
                        <strong>{author.name}</strong>
                        <span>{author.role}</span>
                    </div>
                </div>

                <time title={publishedDateFormated} dateTime={publishedAt.toISOString()}>{publishedDateRelativeToNow}</time>
            </header>

            <div className={styles.content}>
                {content.map(line => {
                    if (line.type === 'paragraph') {
                        return <p key={line.content}>{line.content}</p>
                    } else if (line.type === 'link') {
                        return <p key={line.content}><a href={line.url}>{line.content}</a></p>
                    }
                })}
            </div>

            <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
                <strong>Deixe seu feedback</strong>

                <textarea
                    name="comment"
                    placeholder="Deixe um comentário"
                    onChange={handleNewCommentChange}
                    value={newCommentText}
                    onInvalid={handleNewCommentInvalid}
                    required
                />

                <footer>
                    <button
                        type='submit'
                        disabled={isNewCommentEmpty}
                    >Publicar</button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map(comment => {
                    return <Comment
                        key={comment}
                        content={comment}
                        author={comment.author}
                        publishedAt={comment.publishedAt}
                        onDeleteComment={deleteComment}
                    />
                })}
            </div>
        </article>
    );
}